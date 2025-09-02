from fastapi import APIRouter, Query
from models.schemas import FormRequest
from utils.helpers import sanitize_for_json
from utils.ai_helpers import explain_popularity, explain_similarity
from utils.data_loader import movies_df, cosine_sim  
import openai
import json
import numpy as np
from pydantic import BaseModel
from utils.tmdb import get_poster_url,enrich_with_poster_urls


router = APIRouter()

# ------------------------------
# Helper functions
# ------------------------------

def get_movie_index(movie_id: int):
    match = movies_df.index[movies_df['id'] == movie_id]
    return int(match[0]) if len(match) > 0 else None

def sort_and_sanitize(df, columns, top_n=None):
    if top_n:
        df = df.head(top_n)
    return sanitize_for_json(df[columns]).to_dict(orient='records')

def get_user_history(user_id: str):
    if user_id not in user_history:
        user_history[user_id] = {
            "watched": set(),
            "ratings": {},
            "likes": set(),
            "dislikes": set(),
            "watchlist": set()
        }
    return user_history[user_id]

# ------------------------------
# Catalog
# ------------------------------
@router.get("/catalog")
def catalog(page: int = 1, size: int = 50, q: str = None):
    df = movies_df.copy()
    if q:
        df = df[df['title'].str.lower().str.contains(q.lower())]
    start, end = (page - 1) * size, page * size
    result = sanitize_for_json(df.iloc[start:end]).to_dict(orient='records')
    return enrich_with_poster_urls(result)

# ------------------------------
# Similar Movies with AI
# ------------------------------
@router.get("/recommend/similar/ai")
def recommend_similar_ai(movie_id: int, top_n: int = 5):
    idx = get_movie_index(movie_id)
    if idx is None:
        return []
    sims = sorted(enumerate(cosine_sim[idx]), key=lambda x: x[1], reverse=True)[1:top_n+1]
    indices = [i for i, _ in sims]
    out = movies_df.iloc[indices][
        ["id","title","genres","vote_average","overview","year","cast_clean","crew_clean"]
    ].copy()
    out["score"] = [float(s) for _, s in sims]
    movie_a = movies_df.iloc[idx]
    out["similarity_explanation"] = out.apply(lambda row: explain_similarity(movie_a, row), axis=1)
    result = sanitize_for_json(out).to_dict(orient='records')
    return enrich_with_poster_urls(result)

# ------------------------------
# Popular Movies
# ------------------------------
@router.get("/recommend/popular")
def recommend_popular(top_n: int = 10, genre: str = None, ai: bool = Query(False)):
    df = movies_df.copy()
    if genre:
        df = df[df['genres'].str.contains(genre, case=False, na=False)]
    df['popularity_score'] = df['vote_average'] * np.log1p(df['vote_count'])
    df = df.sort_values('popularity_score', ascending=False).head(top_n)
    result = sanitize_for_json(df[
        ["id","title","genres","vote_average","overview","year","popularity_score"]
    ]).to_dict(orient='records')

    if ai:
        for movie in result:
            movie['ai_explanation'] = explain_popularity(movie)
    return enrich_with_poster_urls(result)

# ------------------------------
# Form-based Recommendation (Hybrid)
# ------------------------------
@router.post("/recommend/by_form_v2")
def recommend_by_form_v2(form: FormRequest):
    df = movies_df[
        (movies_df['vote_average'] >= form.min_rating) &
        (movies_df['year'] >= form.year_from) & (movies_df['year'] <= form.year_to) &
        (movies_df['budget'] >= form.budget_min) & (movies_df['budget'] <= form.budget_max)
    ].copy()

    if form.genre:
        df = df[df['genres'].str.contains(form.genre, case=False, na=False)]

    df['popularity_score'] = df['vote_average'] * np.log1p(df['vote_count'])

    if not df.empty:
        top_idx = df['vote_average'].idxmax()
        sim_scores = cosine_sim[top_idx]
        hybrid_score = 0.6 * sim_scores[df.index] + 0.4 * (df['popularity_score'] / df['popularity_score'].max())
        df['hybrid_score'] = hybrid_score
        df = df.sort_values('hybrid_score', ascending=False).head(20)
    else:
        df = df.head(0)

    result = sanitize_for_json(
        df[["id","title","genres","vote_average","overview","year","popularity_score"]]
    ).to_dict(orient='records')

    return enrich_with_poster_urls(result)

# ------------------------------
# Default Recommendation
# ------------------------------
@router.get("/recommend")
def recommend_default(top_n: int = 10):
    df = movies_df.copy()
    df['popularity_score'] = df['vote_average'] * np.log1p(df['vote_count'])
    df = df.sort_values('popularity_score', ascending=False).head(top_n)
    return sanitize_for_json(
        df[["id","title","genres","vote_average","overview","year","popularity_score"]]
    ).to_dict(orient='records')

# ------------------------------
# Movie Details
# ------------------------------
@router.get("/movie/{movie_id}")
def get_movie(movie_id: int):
    movie = movies_df[movies_df['id'] == movie_id]
    if movie.empty:
        return {"error": "Movie not found"}
    result = sanitize_for_json(
        movie[["id","title","genres","vote_average","overview","year","popularity"]]
    ).to_dict(orient="records")[0]

    result["poster_url"] = get_poster_url(movie_id)
    return result

# ------------------------------
# Conversational Movie Search
# ------------------------------
@router.get("/recommend/chat")
def recommend_chat(query: str, top_n: int = 5):
    query_lower = query.lower()
    filtered = movies_df[
        movies_df["title"].str.lower().str.contains(query_lower, na=False) |
        movies_df["overview"].str.lower().str.contains(query_lower, na=False) |
        movies_df["keywords"].str.lower().str.contains(query_lower, na=False)
    ].head(20)

    movies_context = filtered[["title", "overview", "genres", "year", "vote_average"]].to_dict(orient="records")

    user_prompt = f"""
You are a movie recommendation assistant.

Task:
1. Pick the {top_n} most relevant movies from the dataset below based on the user's query.
2. Include a short explanation why each movie matches the query.
3. Respond ONLY in this JSON format:

{{
  "refined_query": "string",
  "results": [
    {{
      "title": "string",
      "year": "int",
      "vote_average": "float",
      "overview": "string",
      "explanation": "string"
    }}
  ]
}}

User query: "{query}"

Movies (truncated):
{movies_context}
    """

    try:
        response = openai.ChatCompletion.create(
            engine="gpt_35_turbo_16k_navicade",
            messages=[
                {"role": "system", "content": "You are a helpful movie recommendation assistant."},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=1000,
            temperature=0.7
        )

        reply = response["choices"][0]["message"]["content"]

        try:
            parsed = json.loads(reply)
        except json.JSONDecodeError:
            parsed = {"refined_query": query, "results": []}

        # Enrich with poster URLs by matching movie title + year to find local ID
        for movie in parsed["results"]:
            match = movies_df[
                (movies_df["title"].str.lower() == movie["title"].lower()) &
                (movies_df["year"] == movie["year"])
            ]
            if not match.empty:
                movie_id = int(match.iloc[0]["id"])
                movie["poster_url"] = get_poster_url(movie_id)
            else:
                movie["poster_url"] = None

        return parsed

    except Exception as e:
        return {"error": str(e)}

# ------------------------------
# User history storage
# ------------------------------
user_history = {}  # { user_id: {"watched": set(), "ratings": {movie_id: rating}, "likes": set(), "dislikes": set(), "watchlist": set()} }

# Pydantic models for request bodies
class MovieAction(BaseModel):
    movie_id: int

class RateAction(BaseModel):
    movie_id: int
    rating: float

# ------------------------------
# User actions
# ------------------------------

@router.post("/user/{user_id}/like")
def like_movie(user_id: str, data: MovieAction):
    history = get_user_history(user_id)
    history["likes"].add(data.movie_id)
    history["dislikes"].discard(data.movie_id)
    return {"message": f"Movie {data.movie_id} liked by {user_id}"}

@router.post("/user/{user_id}/dislike")
def dislike_movie(user_id: str, data: MovieAction):
    history = get_user_history(user_id)
    history["dislikes"].add(data.movie_id)
    history["likes"].discard(data.movie_id)
    return {"message": f"Movie {data.movie_id} disliked by {user_id}"}

@router.post("/user/{user_id}/watch")
def watch_movie(user_id: str, data: MovieAction):
    history = get_user_history(user_id)
    history["watched"].add(data.movie_id)
    return {"message": f"Movie {data.movie_id} marked as watched by {user_id}"}

@router.post("/user/{user_id}/watchlist")
def add_watchlist(user_id: str, data: MovieAction):
    history = get_user_history(user_id)
    history["watchlist"].add(data.movie_id)
    return {"message": f"Movie {data.movie_id} added to watchlist by {user_id}"}

@router.post("/user/{user_id}/rate")
def rate_movie(user_id: str, data: RateAction):
    history = get_user_history(user_id)
    history["ratings"][data.movie_id] = data.rating
    history["watched"].add(data.movie_id)
    return {"message": f"Movie {data.movie_id} rated {data.rating} by {user_id}"}

# ------------------------------
# Recommendations based on history
# ------------------------------
@router.get("/recommend/user/{user_id}")
def recommend_for_user(user_id: str, top_n: int = 10):
    history = get_user_history(user_id)
    watched = list(history["watched"])
    rated = history["ratings"]

    print(f"Watched movies for {user_id}: {watched}")
    print(f"Ratings for {user_id}: {rated}")

    if not watched:
        return {"error": "No history found for this user."}

    sim_scores = np.zeros(len(movies_df))
    for movie_id in watched:
        idx = get_movie_index(movie_id)
        if idx is None:
            continue
        weight = rated.get(movie_id, 3)
        sim_scores += weight * cosine_sim[idx]

    watched_indices = movies_df[movies_df["id"].isin(watched)].index
    sim_scores[watched_indices] = -1

    top_indices = sim_scores.argsort()[::-1][:top_n]
    print(f"Recommended movies indices: {top_indices}")
    print(f"Recommended movie IDs: {movies_df.iloc[top_indices]['id'].tolist()}")
    out = movies_df.iloc[top_indices][["id","title","genres","vote_average","overview","year"]].copy()
    out["score"] = sim_scores[top_indices]

    print(f"Recommended movies indices: {top_indices}")

    result = sanitize_for_json(out).to_dict(orient="records")
    return enrich_with_poster_urls(result)

# ------------------------------
# User profile
# ------------------------------
@router.get("/user/profile")
def user_profile(user_id: str = "hjindal"):  # hardcoded or get from auth/session
    history = get_user_history(user_id)
    return {
        "likes": list(history["likes"]),
        "dislikes": list(history["dislikes"]),
        "watchlist": list(history["watchlist"]),
        "watched": list(history["watched"]),
        "ratings": history["ratings"],
    }


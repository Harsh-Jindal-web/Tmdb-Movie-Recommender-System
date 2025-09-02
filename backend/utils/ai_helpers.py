import openai
from config import OPENAI_DEPLOYMENT_NAME

def explain_popularity(movie):
    prompt = f"""
Movie:
Title: {movie['title']}
Genres: {movie['genres']}
Overview: {movie['overview']}

Explain concisely why this movie is popular in its genre.
"""
    try:
        response = openai.ChatCompletion.create(
            engine=OPENAI_DEPLOYMENT_NAME,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=80
        )
        return response['choices'][0]['message']['content'].strip()
    except Exception as e:
        return f"Explanation not available ({str(e)})"

def explain_similarity(movie_main, movie_similar):
    prompt = f"""
You are a movie recommendation assistant.

Explain concisely why the movie "{movie_similar['title']}" is similar to "{movie_main['title']}". 
Use the following details:

- "{movie_main['title']}" Overview: {movie_main['overview']}
- "{movie_main['title']}" Genres: {movie_main['genres']}
- "{movie_main['title']}" Cast: {movie_main['cast_clean']}

- "{movie_similar['title']}" Overview: {movie_similar['overview']}
- "{movie_similar['title']}" Genres: {movie_similar['genres']}
- "{movie_similar['title']}" Cast: {movie_similar['cast_clean']}

Keep the explanation short and clear for a user.
"""
    try:
        response = openai.ChatCompletion.create(
            engine=OPENAI_DEPLOYMENT_NAME,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=120
        )
        return response['choices'][0]['message']['content'].strip()
    except Exception as e:
        return f"Explanation not available ({str(e)})"

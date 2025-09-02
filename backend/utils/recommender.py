import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

def build_user_profile(user_data, movies_df, tfidf_matrix):
    """
    user_data = { "likes": [id1, id2], "dislikes": [id3, id4] }
    """
    profile_vector = np.zeros((1, tfidf_matrix.shape[1]))
    
    like_weight, dislike_weight = 1.0, -0.5  # tunable
    
    for movie_id in user_data.get("likes", []):
        idx = movies_df.index[movies_df["id"] == movie_id].tolist()
        if idx: profile_vector += like_weight * tfidf_matrix[idx[0]]
    
    for movie_id in user_data.get("dislikes", []):
        idx = movies_df.index[movies_df["id"] == movie_id].tolist()
        if idx: profile_vector += dislike_weight * tfidf_matrix[idx[0]]
    
    return profile_vector

def recommend_for_user(user_data, movies_df, tfidf_matrix, top_n=10):
    profile = build_user_profile(user_data, movies_df, tfidf_matrix)
    sims = cosine_similarity(profile, tfidf_matrix).flatten()
    
    # Exclude already seen (likes, dislikes, watchlist)
    exclude_ids = set(user_data.get("likes", []) + 
                      user_data.get("dislikes", []) + 
                      user_data.get("watchlist", []))
    
    movie_scores = [
        (movies_df.iloc[i]["id"], sims[i]) 
        for i in range(len(sims)) if movies_df.iloc[i]["id"] not in exclude_ids
    ]
    
    movie_scores.sort(key=lambda x: x[1], reverse=True)
    top_ids = [m[0] for m in movie_scores[:top_n]]
    
    return movies_df[movies_df["id"].isin(top_ids)].to_dict(orient="records")

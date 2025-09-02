import os
import pandas as pd
from ast import literal_eval
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

BASE_DIR = os.path.dirname(os.path.dirname(__file__))  
DATA_DIR = os.path.join(BASE_DIR, "app/data")              

MOVIES_CSV = os.path.join(DATA_DIR, "tmdb_5000_movies.csv")
CREDITS_CSV = os.path.join(DATA_DIR, "tmdb_5000_credits.csv")

def load_data():
    movies = pd.read_csv(MOVIES_CSV)
    credits = pd.read_csv(CREDITS_CSV)
    credits.rename(columns={"movie_id": "id"}, inplace=True)
    merged = movies.merge(credits, on="id")
    merged.rename(columns={"title_x": "title"}, inplace=True)
    return merged

def preprocess_movies(movies_df):
    for col in ['overview', 'genres', 'cast', 'crew']:
        movies_df[col] = movies_df[col].fillna("")
    movies_df['year'] = pd.to_datetime(
        movies_df['release_date'], errors='coerce'
    ).dt.year.fillna(0).astype(int)

    def clean_text(x):
        try:
            return " ".join([i['name'] for i in literal_eval(x)]) if x else ""
        except:
            return ""

    movies_df['cast_clean'] = movies_df['cast'].apply(clean_text)
    movies_df['crew_clean'] = movies_df['crew'].apply(clean_text)
    movies_df['genres_clean'] = movies_df['genres'].apply(clean_text)

    movies_df['text_features'] = (
        movies_df['overview'] + " " +
        movies_df['genres_clean'] + " " +
        movies_df['cast_clean'] + " " +
        movies_df['crew_clean']
    )

    tfidf = TfidfVectorizer(stop_words='english', min_df=1)
    tfidf_matrix = tfidf.fit_transform(movies_df['text_features'])
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

    return movies_df, tfidf_matrix, cosine_sim


movies_df, tfidf_matrix, cosine_sim = preprocess_movies(load_data())

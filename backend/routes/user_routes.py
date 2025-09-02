from fastapi import APIRouter
from utils.data_loader import movies_df, cosine_sim  
from utils.tmdb import get_poster_url,enrich_with_poster_urls

router = APIRouter()

@router.get("/movies/by_ids")
def get_movies_by_ids(ids: str):
    df = movies_df.copy()
    id_list = [int(x) for x in ids.split(",") if x.isdigit()]
    df = movies_df[movies_df["id"].isin(id_list)]
    results = df[["id","title","overview","vote_average","year","genres"]].to_dict(orient="records")
    
    # Enrich each movie with its poster url
    for movie in results:
        movie["poster_url"] = get_poster_url(movie["id"]) 
    
    return results
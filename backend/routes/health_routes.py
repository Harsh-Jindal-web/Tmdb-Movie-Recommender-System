from fastapi import APIRouter
from utils.helpers import sanitize_for_json
from utils.data_loader import movies_df, cosine_sim  
from ast import literal_eval

router = APIRouter()

@router.get("/health")
def health():
    return {"status":"ok", "movies": int(movies_df.shape[0])}

@router.get("/genres")
def get_genres():
    genres_set = set()
    for g_list in movies_df['genres']:
        try:
            for g in literal_eval(g_list):
                genres_set.add(g['name'])
        except:
            continue
    return sorted(list(genres_set))

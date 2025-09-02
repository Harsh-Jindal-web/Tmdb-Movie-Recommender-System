from pydantic import BaseModel

class FormRequest(BaseModel):
    min_rating: float = 0
    genre: str = ""
    year_from: int = 1900
    year_to: int = 2100
    budget_min: float = 0
    budget_max: float = 1e12

class MovieAction(BaseModel):
    movie_id: int
    action: str   # "like", "dislike", "watchlist"

import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

# Configure retry-enabled session
TMDB_API_KEY = ""

session = requests.Session()
retries = Retry(total=3, backoff_factor=0.3, status_forcelist=[500, 502, 503, 504])
session.mount("https://", HTTPAdapter(max_retries=retries))
poster_cache = {}

def get_poster_url(movie_id):
    if movie_id in poster_cache:
        return poster_cache[movie_id]
    
    try:
        url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={TMDB_API_KEY}&language=en-US"
        response = session.get(url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            poster_path = data.get("poster_path")
            if poster_path:
                full_url = f"https://image.tmdb.org/t/p/w500{poster_path}"
                poster_cache[movie_id] = full_url
                return full_url
    except Exception as e:
        print(f"Failed to fetch poster for {movie_id}: {e}")
    
    return None

def enrich_with_poster_urls(movie_list):
    for movie in movie_list:
        movie_id = movie.get("id")
        movie["poster_url"] = get_poster_url(movie_id)
    return movie_list

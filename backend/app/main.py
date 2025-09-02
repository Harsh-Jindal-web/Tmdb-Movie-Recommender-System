from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.movie_routes import router as movie_router
from routes.user_routes import router as user_router
from routes.health_routes import router as health_router

app = FastAPI(title="TMDb Movie Recommender", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(movie_router)
app.include_router(user_router)
app.include_router(health_router)

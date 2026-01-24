from fastapi import FastAPI
from .database.db import engine, Base
from .routes import anime, character
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(_: FastAPI):
    from .seed import seed_database
    seed_database()
    yield

app = FastAPI(title="Anime Characters API", lifespan=lifespan)
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # Allows specific origins
    allow_credentials=True,         # Allows cookies/auth headers to be sent cross-origin
    allow_methods=["*"],            # Allows all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],            # Allows all headers
)
app.include_router(anime.router)
app.include_router(character.router)
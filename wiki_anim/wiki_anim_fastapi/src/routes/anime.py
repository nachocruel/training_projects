from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database.db import get_db
from ..database.models.anime import Anime
from ..schemas.anime import AnimeCreate, AnimeUpdate, AnimeResponse

router = APIRouter(prefix="/animes", tags=["Animes"])

@router.post("/", response_model=AnimeResponse, status_code=status.HTTP_201_CREATED)
def create_anime(data: AnimeCreate, db: Session = Depends(get_db)):
    anime = Anime(**data.model_dump())
    db.add(anime)
    db.commit()
    db.refresh(anime)
    return anime

@router.get("/", response_model=list[AnimeResponse])
def get_animes(db: Session = Depends(get_db)):
    return db.query(Anime).all()

@router.get("/{anime_id}", response_model=AnimeResponse)
def get_anime(anime_id: int, db: Session = Depends(get_db)):
    anime = db.get(Anime, anime_id)
    if not anime:
        raise HTTPException(status_code=404, detail="Anime not found")
    return anime


@router.put("/{anime_id}", response_model=AnimeResponse)
def update_anime(anime_id: int, data: AnimeUpdate, db: Session = Depends(get_db)):
    anime = db.get(Anime, anime_id)
    if not anime:
        raise HTTPException(status_code=404, detail="Anime not found")

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(anime, key, value)

    db.commit()
    db.refresh(anime)
    return anime


@router.delete("/{anime_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_anime(anime_id: int, db: Session = Depends(get_db)):
    anime = db.get(Anime, anime_id)
    if not anime:
        raise HTTPException(status_code=404, detail="Anime not found")

    db.delete(anime)
    db.commit()


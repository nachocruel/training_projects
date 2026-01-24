from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database.db import get_db
from ..database.models.character import Character
from ..database.models.anime import Anime

from ..schemas.character import (
    CharacterCreate,
    CharacterUpdate,
    CharacterResponse
)

router = APIRouter(prefix="/characters", tags=["Characters"])

@router.post("/", response_model=CharacterResponse, status_code=status.HTTP_201_CREATED)
def create_character(data: CharacterCreate, db: Session = Depends(get_db)):
    anime = db.get(Anime, data.anime_id)
    if not anime:
        raise HTTPException(status_code=404, detail="Anime not found")

    character = Character(**data.model_dump())
    db.add(character)
    db.commit()
    db.refresh(character)
    return character


@router.get("/", response_model=list[CharacterResponse])
def get_characters(db: Session = Depends(get_db)):
    return db.query(Character).all()


@router.get("/{character_id}", response_model=CharacterResponse)
def get_character(character_id: int, db: Session = Depends(get_db)):
    character = db.get(Character, character_id)
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")
    return character


@router.put("/{character_id}", response_model=CharacterResponse)
def update_character(
    character_id: int,
    data: CharacterUpdate,
    db: Session = Depends(get_db)
):
    character = db.get(Character, character_id)
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(character, key, value)

    db.commit()
    db.refresh(character)
    return character

@router.delete("/{character_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_character(character_id: int, db: Session = Depends(get_db)):
    character = db.get(Character, character_id)
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")

    db.delete(character)
    db.commit()

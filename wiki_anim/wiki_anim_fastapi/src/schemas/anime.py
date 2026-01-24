from pydantic import BaseModel
from typing import List
from .character import CharacterResponse

class AnimeBase(BaseModel):
    title: str
    studio: str | None = None
    release_year: int | None = None

class AnimeCreate(AnimeBase):
    pass

class AnimeUpdate(AnimeBase):
    pass

class AnimeResponse(AnimeBase):
    id: int
    characters: List[CharacterResponse] = []

    class Config:
        from_attributes = True

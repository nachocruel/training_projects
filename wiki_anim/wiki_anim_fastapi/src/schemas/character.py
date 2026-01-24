from pydantic import BaseModel

class CharacterBase(BaseModel):
    name: str
    role: str | None = None
    description: str | None = None
    image_url: str | None = None

class CharacterCreate(CharacterBase):
    anime_id: int

class CharacterUpdate(CharacterBase):
    pass

class CharacterResponse(CharacterBase):
    id: int
    anime_id: int

    class Config:
        from_attributes = True

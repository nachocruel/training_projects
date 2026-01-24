from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.database.db import Base

class Anime(Base):
    __tablename__ = "animes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    studio: Mapped[str | None] = mapped_column(String(255))
    release_year: Mapped[int | None]

    characters: Mapped[list["Character"]] = relationship(
        back_populates="anime",
        cascade="all, delete-orphan"
    )

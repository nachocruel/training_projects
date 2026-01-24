from sqlalchemy import String, Integer, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.database.db import Base
from src.database.models.anime import Anime

class Character(Base):
    __tablename__ = "characters"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str | None] = mapped_column(String(50))
    image_url: Mapped[str | None] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text)

    anime_id: Mapped[int] = mapped_column(
        ForeignKey("animes.id", ondelete="CASCADE"),
        nullable=False
    )

    anime: Mapped["Anime"] = relationship(back_populates="characters")

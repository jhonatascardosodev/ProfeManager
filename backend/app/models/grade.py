from datetime import datetime, timezone

from sqlmodel import Field, SQLModel


class Grade(SQLModel, table=True):
    __tablename__ = "grades"

    id: int | None = Field(default=None, primary_key=True)
    owner_id: int = Field(foreign_key="users.id", index=True)
    student_name: str = Field(min_length=1, max_length=160)
    subject: str = Field(min_length=1, max_length=120)
    score_1: float | None = Field(default=None, ge=0, le=10)
    score_2: float | None = Field(default=None, ge=0, le=10)
    score_3: float | None = Field(default=None, ge=0, le=10)
    score_4: float | None = Field(default=None, ge=0, le=10)
    note: str = Field(default="", max_length=500)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

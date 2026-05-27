from datetime import datetime, timezone

from sqlmodel import Field, SQLModel


class Classroom(SQLModel, table=True):
    __tablename__ = "classrooms"

    id: int | None = Field(default=None, primary_key=True)
    owner_id: int = Field(foreign_key="users.id", index=True)
    subject: str = Field(min_length=1, max_length=120)
    student_count: int = Field(ge=1, le=200)
    rows: int = Field(ge=1, le=20)
    mode: str = Field(default="separado", max_length=20)
    seats_json: str = Field(default="[]")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

SeatingMode = Literal["separado", "juntos", "aleatorio"]


class Seat(BaseModel):
    seat: int
    name: str
    tag: str = ""


class ClassroomCreate(BaseModel):
    subject: str = Field(min_length=1, max_length=120)
    student_count: int = Field(ge=1, le=200)
    rows: int = Field(ge=1, le=20)
    mode: SeatingMode = "separado"
    seats: list[Seat] = Field(default_factory=list)


class ClassroomUpdate(BaseModel):
    subject: str | None = Field(default=None, min_length=1, max_length=120)
    student_count: int | None = Field(default=None, ge=1, le=200)
    rows: int | None = Field(default=None, ge=1, le=20)
    mode: SeatingMode | None = None
    seats: list[Seat] | None = None


class ClassroomPublic(BaseModel):
    id: int
    subject: str
    student_count: int
    rows: int
    mode: str
    seats: list[Seat]
    created_at: datetime
    updated_at: datetime

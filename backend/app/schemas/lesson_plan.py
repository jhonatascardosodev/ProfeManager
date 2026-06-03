from datetime import datetime

from pydantic import BaseModel, Field


class LessonPlanCreate(BaseModel):
    subject: str = Field(min_length=1, max_length=120)
    grade_class: str = Field(default="", max_length=80)
    topic: str = Field(min_length=1, max_length=200)
    duration_minutes: int | None = Field(default=None, ge=15, le=300)
    objectives: str = ""
    materials: str = ""
    books: str = ""
    activities: str = ""
    evaluation: str = ""
    notes: str = Field(default="", max_length=2000)
    scheduled_for: datetime | None = None


class LessonPlanUpdate(BaseModel):
    subject: str | None = Field(default=None, min_length=1, max_length=120)
    grade_class: str | None = Field(default=None, max_length=80)
    topic: str | None = Field(default=None, min_length=1, max_length=200)
    duration_minutes: int | None = Field(default=None, ge=15, le=300)
    objectives: str | None = None
    materials: str | None = None
    books: str | None = None
    activities: str | None = None
    evaluation: str | None = None
    notes: str | None = Field(default=None, max_length=2000)
    scheduled_for: datetime | None = None


class LessonPlanPublic(BaseModel):
    id: int
    subject: str
    grade_class: str
    topic: str
    duration_minutes: int | None
    objectives: str
    materials: str
    books: str
    activities: str
    evaluation: str
    notes: str
    scheduled_for: datetime | None
    created_at: datetime
    updated_at: datetime

from datetime import datetime

from pydantic import BaseModel, Field


class LessonPlanCreate(BaseModel):
    subject: str = Field(min_length=1, max_length=120)
    topic: str = Field(min_length=1, max_length=200)
    objectives: str = ""
    materials: str = ""
    books: str = ""
    activities: str = ""
    evaluation: str = ""
    scheduled_for: datetime | None = None


class LessonPlanUpdate(BaseModel):
    subject: str | None = Field(default=None, min_length=1, max_length=120)
    topic: str | None = Field(default=None, min_length=1, max_length=200)
    objectives: str | None = None
    materials: str | None = None
    books: str | None = None
    activities: str | None = None
    evaluation: str | None = None
    scheduled_for: datetime | None = None


class LessonPlanPublic(BaseModel):
    id: int
    subject: str
    topic: str
    objectives: str
    materials: str
    books: str
    activities: str
    evaluation: str
    scheduled_for: datetime | None
    created_at: datetime
    updated_at: datetime

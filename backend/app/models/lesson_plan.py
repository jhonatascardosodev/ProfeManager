from datetime import datetime, timezone

from sqlmodel import Field, SQLModel


class LessonPlan(SQLModel, table=True):
    __tablename__ = "lesson_plans"

    id: int | None = Field(default=None, primary_key=True)
    owner_id: int = Field(foreign_key="users.id", index=True)
    subject: str = Field(min_length=1, max_length=120)
    grade_class: str = Field(default="", max_length=80)
    topic: str = Field(min_length=1, max_length=200)
    duration_minutes: int | None = Field(default=None, ge=15, le=300)
    objectives: str = Field(default="")
    materials: str = Field(default="")
    books: str = Field(default="")
    activities: str = Field(default="")
    evaluation: str = Field(default="")
    notes: str = Field(default="", max_length=2000)
    scheduled_for: datetime | None = Field(default=None)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

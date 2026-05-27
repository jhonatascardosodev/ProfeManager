from datetime import datetime

from pydantic import BaseModel, Field, computed_field


class GradeCreate(BaseModel):
    student_name: str = Field(min_length=1, max_length=160)
    subject: str = Field(min_length=1, max_length=120)
    score_1: float | None = Field(default=None, ge=0, le=10)
    score_2: float | None = Field(default=None, ge=0, le=10)
    score_3: float | None = Field(default=None, ge=0, le=10)
    score_4: float | None = Field(default=None, ge=0, le=10)
    note: str = Field(default="", max_length=500)


class GradeUpdate(BaseModel):
    student_name: str | None = Field(default=None, min_length=1, max_length=160)
    subject: str | None = Field(default=None, min_length=1, max_length=120)
    score_1: float | None = Field(default=None, ge=0, le=10)
    score_2: float | None = Field(default=None, ge=0, le=10)
    score_3: float | None = Field(default=None, ge=0, le=10)
    score_4: float | None = Field(default=None, ge=0, le=10)
    note: str | None = Field(default=None, max_length=500)


class GradePublic(BaseModel):
    id: int
    student_name: str
    subject: str
    score_1: float | None
    score_2: float | None
    score_3: float | None
    score_4: float | None
    note: str
    created_at: datetime
    updated_at: datetime

    @computed_field
    @property
    def average(self) -> float | None:
        scores = [s for s in (self.score_1, self.score_2, self.score_3, self.score_4) if s is not None]
        if not scores:
            return None
        return round(sum(scores) / len(scores), 2)

    @computed_field
    @property
    def status(self) -> str:
        avg = self.average
        if avg is None:
            return "sem-nota"
        if avg >= 7:
            return "aprovado"
        if avg >= 5:
            return "recuperacao"
        return "reprovado"

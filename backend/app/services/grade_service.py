from datetime import datetime, timezone

from sqlmodel import Session, select

from app.models.grade import Grade
from app.schemas.grade import GradeCreate, GradeUpdate


def list_for_user(
    session: Session, owner_id: int, subject: str | None = None
) -> list[Grade]:
    statement = select(Grade).where(Grade.owner_id == owner_id)
    if subject:
        statement = statement.where(Grade.subject == subject)
    statement = statement.order_by(Grade.student_name)  # type: ignore[arg-type]
    return list(session.exec(statement).all())


def get_for_user(session: Session, owner_id: int, grade_id: int) -> Grade | None:
    grade = session.get(Grade, grade_id)
    if grade is None or grade.owner_id != owner_id:
        return None
    return grade


def create(session: Session, owner_id: int, data: GradeCreate) -> Grade:
    grade = Grade(owner_id=owner_id, **data.model_dump())
    session.add(grade)
    session.commit()
    session.refresh(grade)
    return grade


def update(session: Session, owner_id: int, grade_id: int, data: GradeUpdate) -> Grade | None:
    grade = get_for_user(session, owner_id, grade_id)
    if grade is None:
        return None
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(grade, key, value)
    grade.updated_at = datetime.now(timezone.utc)
    session.add(grade)
    session.commit()
    session.refresh(grade)
    return grade


def delete(session: Session, owner_id: int, grade_id: int) -> bool:
    grade = get_for_user(session, owner_id, grade_id)
    if grade is None:
        return False
    session.delete(grade)
    session.commit()
    return True


def stats(session: Session, owner_id: int, subject: str | None = None) -> dict[str, int | float]:
    grades = list_for_user(session, owner_id, subject)
    total = len(grades)
    approved = 0
    recuperation = 0
    failed = 0
    no_grade = 0
    averages: list[float] = []

    for grade in grades:
        scores = [
            s
            for s in (grade.score_1, grade.score_2, grade.score_3, grade.score_4, grade.participation)
            if s is not None
        ]
        if not scores:
            no_grade += 1
            continue
        avg = sum(scores) / len(scores)
        averages.append(avg)
        if avg >= 7:
            approved += 1
        elif avg >= 5:
            recuperation += 1
        else:
            failed += 1

    overall_avg = round(sum(averages) / len(averages), 2) if averages else 0.0

    return {
        "total": total,
        "approved": approved,
        "recuperation": recuperation,
        "failed": failed,
        "no_grade": no_grade,
        "average": overall_avg,
    }

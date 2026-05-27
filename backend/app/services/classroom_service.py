import json
from datetime import datetime, timezone

from sqlmodel import Session, select

from app.models.classroom import Classroom
from app.schemas.classroom import ClassroomCreate, ClassroomPublic, ClassroomUpdate, Seat


def _to_public(classroom: Classroom) -> ClassroomPublic:
    try:
        seats_raw = json.loads(classroom.seats_json or "[]")
    except json.JSONDecodeError:
        seats_raw = []
    seats = [Seat(**s) for s in seats_raw if isinstance(s, dict)]
    return ClassroomPublic(
        id=classroom.id,  # type: ignore[arg-type]
        subject=classroom.subject,
        student_count=classroom.student_count,
        rows=classroom.rows,
        mode=classroom.mode,
        seats=seats,
        created_at=classroom.created_at,
        updated_at=classroom.updated_at,
    )


def list_for_user(session: Session, owner_id: int) -> list[ClassroomPublic]:
    statement = select(Classroom).where(Classroom.owner_id == owner_id).order_by(Classroom.id.desc())  # type: ignore[union-attr]
    return [_to_public(c) for c in session.exec(statement).all()]


def get_for_user(session: Session, owner_id: int, classroom_id: int) -> ClassroomPublic | None:
    classroom = session.get(Classroom, classroom_id)
    if classroom is None or classroom.owner_id != owner_id:
        return None
    return _to_public(classroom)


def create(session: Session, owner_id: int, data: ClassroomCreate) -> ClassroomPublic:
    classroom = Classroom(
        owner_id=owner_id,
        subject=data.subject,
        student_count=data.student_count,
        rows=data.rows,
        mode=data.mode,
        seats_json=json.dumps([s.model_dump() for s in data.seats]),
    )
    session.add(classroom)
    session.commit()
    session.refresh(classroom)
    return _to_public(classroom)


def update(
    session: Session, owner_id: int, classroom_id: int, data: ClassroomUpdate
) -> ClassroomPublic | None:
    classroom = session.get(Classroom, classroom_id)
    if classroom is None or classroom.owner_id != owner_id:
        return None

    update_data = data.model_dump(exclude_unset=True)
    if "seats" in update_data and update_data["seats"] is not None:
        classroom.seats_json = json.dumps([s for s in update_data["seats"]])
        del update_data["seats"]

    for key, value in update_data.items():
        setattr(classroom, key, value)
    classroom.updated_at = datetime.now(timezone.utc)
    session.add(classroom)
    session.commit()
    session.refresh(classroom)
    return _to_public(classroom)


def delete(session: Session, owner_id: int, classroom_id: int) -> bool:
    classroom = session.get(Classroom, classroom_id)
    if classroom is None or classroom.owner_id != owner_id:
        return False
    session.delete(classroom)
    session.commit()
    return True

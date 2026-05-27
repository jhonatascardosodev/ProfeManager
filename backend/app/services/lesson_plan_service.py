from datetime import datetime, timezone

from sqlmodel import Session, select

from app.models.lesson_plan import LessonPlan
from app.schemas.lesson_plan import LessonPlanCreate, LessonPlanUpdate


def list_for_user(session: Session, owner_id: int) -> list[LessonPlan]:
    statement = (
        select(LessonPlan)
        .where(LessonPlan.owner_id == owner_id)
        .order_by(LessonPlan.id.desc())  # type: ignore[union-attr]
    )
    return list(session.exec(statement).all())


def get_for_user(session: Session, owner_id: int, plan_id: int) -> LessonPlan | None:
    plan = session.get(LessonPlan, plan_id)
    if plan is None or plan.owner_id != owner_id:
        return None
    return plan


def create(session: Session, owner_id: int, data: LessonPlanCreate) -> LessonPlan:
    plan = LessonPlan(owner_id=owner_id, **data.model_dump())
    session.add(plan)
    session.commit()
    session.refresh(plan)
    return plan


def update(
    session: Session, owner_id: int, plan_id: int, data: LessonPlanUpdate
) -> LessonPlan | None:
    plan = get_for_user(session, owner_id, plan_id)
    if plan is None:
        return None
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(plan, key, value)
    plan.updated_at = datetime.now(timezone.utc)
    session.add(plan)
    session.commit()
    session.refresh(plan)
    return plan


def delete(session: Session, owner_id: int, plan_id: int) -> bool:
    plan = get_for_user(session, owner_id, plan_id)
    if plan is None:
        return False
    session.delete(plan)
    session.commit()
    return True

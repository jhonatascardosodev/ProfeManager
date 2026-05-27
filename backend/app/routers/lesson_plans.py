from fastapi import APIRouter, HTTPException, status

from app.core.deps import CurrentUser, SessionDep
from app.schemas.lesson_plan import LessonPlanCreate, LessonPlanPublic, LessonPlanUpdate
from app.services import lesson_plan_service

router = APIRouter(prefix="/api/lesson-plans", tags=["lesson-plans"])


@router.get("", response_model=list[LessonPlanPublic])
def list_plans(session: SessionDep, current_user: CurrentUser) -> list[LessonPlanPublic]:
    plans = lesson_plan_service.list_for_user(session, current_user.id)  # type: ignore[arg-type]
    return [LessonPlanPublic.model_validate(p, from_attributes=True) for p in plans]


@router.post("", response_model=LessonPlanPublic, status_code=status.HTTP_201_CREATED)
def create_plan(
    payload: LessonPlanCreate, session: SessionDep, current_user: CurrentUser
) -> LessonPlanPublic:
    plan = lesson_plan_service.create(session, current_user.id, payload)  # type: ignore[arg-type]
    return LessonPlanPublic.model_validate(plan, from_attributes=True)


@router.get("/{plan_id}", response_model=LessonPlanPublic)
def get_plan(plan_id: int, session: SessionDep, current_user: CurrentUser) -> LessonPlanPublic:
    plan = lesson_plan_service.get_for_user(session, current_user.id, plan_id)  # type: ignore[arg-type]
    if plan is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plano não encontrado.")
    return LessonPlanPublic.model_validate(plan, from_attributes=True)


@router.patch("/{plan_id}", response_model=LessonPlanPublic)
def update_plan(
    plan_id: int,
    payload: LessonPlanUpdate,
    session: SessionDep,
    current_user: CurrentUser,
) -> LessonPlanPublic:
    plan = lesson_plan_service.update(session, current_user.id, plan_id, payload)  # type: ignore[arg-type]
    if plan is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plano não encontrado.")
    return LessonPlanPublic.model_validate(plan, from_attributes=True)


@router.delete("/{plan_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_plan(plan_id: int, session: SessionDep, current_user: CurrentUser) -> None:
    deleted = lesson_plan_service.delete(session, current_user.id, plan_id)  # type: ignore[arg-type]
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plano não encontrado.")

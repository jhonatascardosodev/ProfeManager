from fastapi import APIRouter, HTTPException, Query, status

from app.core.deps import CurrentUser, SessionDep
from app.schemas.grade import GradeCreate, GradePublic, GradeUpdate
from app.services import grade_service

router = APIRouter(prefix="/api/grades", tags=["grades"])


@router.get("", response_model=list[GradePublic])
def list_grades(
    session: SessionDep,
    current_user: CurrentUser,
    subject: str | None = Query(default=None),
) -> list[GradePublic]:
    grades = grade_service.list_for_user(session, current_user.id, subject)  # type: ignore[arg-type]
    return [GradePublic.model_validate(g, from_attributes=True) for g in grades]


@router.get("/stats", response_model=dict)
def grade_stats(
    session: SessionDep,
    current_user: CurrentUser,
    subject: str | None = Query(default=None),
) -> dict:
    return grade_service.stats(session, current_user.id, subject)  # type: ignore[arg-type]


@router.post("", response_model=GradePublic, status_code=status.HTTP_201_CREATED)
def create_grade(
    payload: GradeCreate, session: SessionDep, current_user: CurrentUser
) -> GradePublic:
    grade = grade_service.create(session, current_user.id, payload)  # type: ignore[arg-type]
    return GradePublic.model_validate(grade, from_attributes=True)


@router.patch("/{grade_id}", response_model=GradePublic)
def update_grade(
    grade_id: int,
    payload: GradeUpdate,
    session: SessionDep,
    current_user: CurrentUser,
) -> GradePublic:
    grade = grade_service.update(session, current_user.id, grade_id, payload)  # type: ignore[arg-type]
    if grade is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Nota não encontrada.")
    return GradePublic.model_validate(grade, from_attributes=True)


@router.delete("/{grade_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_grade(grade_id: int, session: SessionDep, current_user: CurrentUser) -> None:
    deleted = grade_service.delete(session, current_user.id, grade_id)  # type: ignore[arg-type]
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Nota não encontrada.")

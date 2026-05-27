from fastapi import APIRouter, HTTPException, status

from app.core.deps import CurrentUser, SessionDep
from app.schemas.classroom import ClassroomCreate, ClassroomPublic, ClassroomUpdate
from app.services import classroom_service

router = APIRouter(prefix="/api/classrooms", tags=["classrooms"])


@router.get("", response_model=list[ClassroomPublic])
def list_classrooms(session: SessionDep, current_user: CurrentUser) -> list[ClassroomPublic]:
    return classroom_service.list_for_user(session, current_user.id)  # type: ignore[arg-type]


@router.post("", response_model=ClassroomPublic, status_code=status.HTTP_201_CREATED)
def create_classroom(
    payload: ClassroomCreate, session: SessionDep, current_user: CurrentUser
) -> ClassroomPublic:
    return classroom_service.create(session, current_user.id, payload)  # type: ignore[arg-type]


@router.get("/{classroom_id}", response_model=ClassroomPublic)
def get_classroom(
    classroom_id: int, session: SessionDep, current_user: CurrentUser
) -> ClassroomPublic:
    classroom = classroom_service.get_for_user(session, current_user.id, classroom_id)  # type: ignore[arg-type]
    if classroom is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Turma não encontrada.")
    return classroom


@router.patch("/{classroom_id}", response_model=ClassroomPublic)
def update_classroom(
    classroom_id: int,
    payload: ClassroomUpdate,
    session: SessionDep,
    current_user: CurrentUser,
) -> ClassroomPublic:
    classroom = classroom_service.update(session, current_user.id, classroom_id, payload)  # type: ignore[arg-type]
    if classroom is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Turma não encontrada.")
    return classroom


@router.delete("/{classroom_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_classroom(
    classroom_id: int, session: SessionDep, current_user: CurrentUser
) -> None:
    deleted = classroom_service.delete(session, current_user.id, classroom_id)  # type: ignore[arg-type]
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Turma não encontrada.")

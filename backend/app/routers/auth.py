from fastapi import APIRouter, HTTPException, status

from app.core.deps import CurrentUser, SessionDep
from app.core.security import create_access_token
from app.schemas.auth import (
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    LoginRequest,
    ResetPasswordRequest,
    ResetPasswordResponse,
    SignUpRequest,
    TokenResponse,
    UserPublic,
)
from app.services import password_reset_service, user_service

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: SignUpRequest, session: SessionDep) -> TokenResponse:
    existing = user_service.get_by_email(session, payload.email)
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="E-mail já cadastrado.",
        )

    user = user_service.create(session, payload.name, payload.email, payload.password)
    token = create_access_token(user.id)
    return TokenResponse(access_token=token, user=UserPublic.model_validate(user, from_attributes=True))


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, session: SessionDep) -> TokenResponse:
    user = user_service.authenticate(session, payload.email, payload.password)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha inválidos.",
        )
    token = create_access_token(user.id)
    return TokenResponse(access_token=token, user=UserPublic.model_validate(user, from_attributes=True))


@router.get("/me", response_model=UserPublic)
def me(current_user: CurrentUser) -> UserPublic:
    return UserPublic.model_validate(current_user, from_attributes=True)


@router.post("/forgot-password", response_model=ForgotPasswordResponse)
def forgot_password(payload: ForgotPasswordRequest, session: SessionDep) -> ForgotPasswordResponse:
    message, reset_link = password_reset_service.request_reset(session, payload.email)
    return ForgotPasswordResponse(message=message, reset_link=reset_link)


@router.post("/reset-password", response_model=ResetPasswordResponse)
def reset_password(payload: ResetPasswordRequest, session: SessionDep) -> ResetPasswordResponse:
    try:
        password_reset_service.reset_password(session, payload.token, payload.password)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    return ResetPasswordResponse(message="Senha redefinida com sucesso. Você já pode entrar.")

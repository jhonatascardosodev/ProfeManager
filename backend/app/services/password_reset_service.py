import secrets
from datetime import datetime, timedelta, timezone

from sqlmodel import Session, select

from app.core.config import settings
from app.core.security import hash_password
from app.models.password_reset import PasswordResetToken
from app.models.user import User
from app.services import user_service

RESET_MESSAGE = (
    "Se existir uma conta com esse e-mail, você receberá instruções para redefinir a senha."
)
TOKEN_TTL_MINUTES = 60


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def request_reset(session: Session, email: str) -> tuple[str, str | None]:
    """
    Create a reset token if the user exists.
    Returns (message, reset_link) — link only when debug=True and user exists.
    """
    user = user_service.get_by_email(session, email)
    if user is None:
        return RESET_MESSAGE, None

    _invalidate_active_tokens(session, user.id)

    raw_token = secrets.token_urlsafe(32)
    record = PasswordResetToken(
        user_id=user.id,  # type: ignore[arg-type]
        token=raw_token,
        expires_at=_utcnow() + timedelta(minutes=TOKEN_TTL_MINUTES),
    )
    session.add(record)
    session.commit()

    reset_link = None
    if settings.debug:
        base = settings.frontend_url.rstrip("/")
        reset_link = f"{base}/redefinir-senha?token={raw_token}"

    return RESET_MESSAGE, reset_link


def reset_password(session: Session, token: str, new_password: str) -> None:
    record = _get_valid_token(session, token)
    if record is None:
        raise ValueError("Link inválido ou expirado.")

    user = session.get(User, record.user_id)
    if user is None or not user.is_active:
        raise ValueError("Link inválido ou expirado.")

    user.password_hash = hash_password(new_password)
    record.used_at = _utcnow()
    session.add(user)
    session.add(record)
    session.commit()


def _invalidate_active_tokens(session: Session, user_id: int) -> None:
    now = _utcnow()
    statement = select(PasswordResetToken).where(
        PasswordResetToken.user_id == user_id,
        PasswordResetToken.used_at.is_(None),  # type: ignore[union-attr]
        PasswordResetToken.expires_at > now,
    )
    for record in session.exec(statement).all():
        record.used_at = now
        session.add(record)
    session.commit()


def _get_valid_token(session: Session, token: str) -> PasswordResetToken | None:
    statement = select(PasswordResetToken).where(PasswordResetToken.token == token)
    record = session.exec(statement).first()
    if record is None or record.used_at is not None:
        return None
    expires = record.expires_at
    if expires.tzinfo is None:
        expires = expires.replace(tzinfo=timezone.utc)
    if expires < _utcnow():
        return None
    return record

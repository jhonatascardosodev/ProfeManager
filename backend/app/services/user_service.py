from sqlmodel import Session, select

from app.core.security import hash_password, verify_password
from app.models.user import User


def get_by_id(session: Session, user_id: int) -> User | None:
    return session.get(User, user_id)


def get_by_email(session: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email.lower())
    return session.exec(statement).first()


def create(session: Session, name: str, email: str, password: str) -> User:
    user = User(
        name=name.strip(),
        email=email.lower().strip(),
        password_hash=hash_password(password),
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def authenticate(session: Session, email: str, password: str) -> User | None:
    user = get_by_email(session, email)
    if user is None or not user.is_active:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user


def update_profile(
    session: Session,
    user: User,
    *,
    name: str | None = None,
    email: str | None = None,
) -> User:
    if name is not None:
        user.name = name.strip()

    if email is not None:
        normalized = email.lower().strip()
        if normalized != user.email:
            existing = get_by_email(session, normalized)
            if existing is not None and existing.id != user.id:
                raise ValueError("E-mail já cadastrado.")
            user.email = normalized

    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def change_password(session: Session, user: User, current_password: str, new_password: str) -> None:
    if not verify_password(current_password, user.password_hash):
        raise ValueError("Senha atual incorreta.")

    user.password_hash = hash_password(new_password)
    session.add(user)
    session.commit()

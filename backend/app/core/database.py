from collections.abc import Generator

from sqlmodel import Session, SQLModel, create_engine

from app.core.config import settings

connect_args = {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}

engine = create_engine(settings.database_url, echo=False, connect_args=connect_args)


def init_db() -> None:
    """Create all tables. Import models so SQLModel registers them in metadata."""

    from app.core.migrations import run_migrations
    from app.models import classroom, grade, lesson_plan, password_reset, user  # noqa: F401

    SQLModel.metadata.create_all(engine)
    run_migrations()


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session

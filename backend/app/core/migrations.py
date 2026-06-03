"""Lightweight SQLite migrations for development (adds missing columns)."""

from sqlalchemy import inspect, text

from app.core.database import engine


def _has_column(table: str, column: str) -> bool:
    inspector = inspect(engine)
    if table not in inspector.get_table_names():
        return False
    return column in {col["name"] for col in inspector.get_columns(table)}


def _add_column(sql: str) -> None:
    with engine.begin() as conn:
        conn.execute(text(sql))


def run_migrations() -> None:
    if not str(engine.url).startswith("sqlite"):
        return

    if not _has_column("grades", "grade_class"):
        _add_column("ALTER TABLE grades ADD COLUMN grade_class TEXT DEFAULT ''")

    if not _has_column("grades", "participation"):
        _add_column("ALTER TABLE grades ADD COLUMN participation REAL")

    if not _has_column("lesson_plans", "grade_class"):
        _add_column("ALTER TABLE lesson_plans ADD COLUMN grade_class TEXT DEFAULT ''")

    if not _has_column("lesson_plans", "duration_minutes"):
        _add_column("ALTER TABLE lesson_plans ADD COLUMN duration_minutes INTEGER")

    if not _has_column("lesson_plans", "notes"):
        _add_column("ALTER TABLE lesson_plans ADD COLUMN notes TEXT DEFAULT ''")

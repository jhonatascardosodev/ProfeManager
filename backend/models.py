import sqlite3
from pathlib import Path


def init_db(db_path: Path) -> None:
    with sqlite3.connect(db_path) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE
            )
            """
        )
        conn.execute(
            """
            INSERT OR IGNORE INTO users (id, name, email)
            VALUES (1, 'Admin', 'admin@profemanager.local')
            """
        )
        conn.commit()


def list_users(db_path: Path) -> list[dict[str, object]]:
    with sqlite3.connect(db_path) as conn:
        conn.row_factory = sqlite3.Row
        rows = conn.execute("SELECT id, name, email FROM users ORDER BY id").fetchall()
        return [dict(row) for row in rows]

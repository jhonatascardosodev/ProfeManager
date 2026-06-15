from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.validation_errors import validation_error_message
from app.core.database import init_db
from app.routers import auth, classrooms, grades, lesson_plans


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=(
        "API REST para o ProfeManager: autenticação, mapa de sala, planejamento e notas.\n\n"
        "**Como testar no Swagger:**\n"
        "1. Use `POST /api/auth/signup` ou `POST /api/auth/login`.\n"
        "2. Copie o `access_token` da resposta.\n"
        "3. Clique em **Authorize** e cole só o token (sem escrever Bearer)."
    ),
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(classrooms.router)
app.include_router(lesson_plans.router)
app.include_router(grades.router)


@app.exception_handler(RequestValidationError)
async def request_validation_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
    messages = [validation_error_message(err) for err in exc.errors()]
    detail = messages[0] if len(messages) == 1 else messages
    return JSONResponse(status_code=422, content={"detail": detail})


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    from fastapi.openapi.utils import get_openapi

    schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "Cole o access_token retornado em /api/auth/login ou /api/auth/signup.",
        }
    }
    for path in schema.get("paths", {}).values():
        for operation in path.values():
            if isinstance(operation, dict) and operation.get("security"):
                operation["security"] = [{"BearerAuth": []}]

    app.openapi_schema = schema
    return app.openapi_schema


app.openapi = custom_openapi


@app.get("/", tags=["meta"])
def root() -> dict[str, str | list[str]]:
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "docs": "/docs",
        "endpoints": [
            "/api/auth/signup",
            "/api/auth/login",
            "/api/auth/me",
            "/api/auth/forgot-password",
            "/api/auth/reset-password",
            "/api/classrooms",
            "/api/lesson-plans",
            "/api/grades",
            "/api/grades/stats",
        ],
    }


@app.get("/health", tags=["meta"])
def health() -> dict[str, str]:
    return {"status": "ok"}

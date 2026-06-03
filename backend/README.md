# ProfeManager — Backend

API REST em **FastAPI** + **SQLModel** + **JWT** para o ProfeManager.

## Stack

- Python 3.11+
- FastAPI (framework web + OpenAPI/Swagger automático)
- SQLModel (ORM em cima do SQLAlchemy)
- SQLite (banco de desenvolvimento)
- Passlib + bcrypt (hash de senha)
- python-jose (JWT)
- Pydantic Settings (configuração via `.env`)

## Estrutura

```
backend/
  app/
    core/
      config.py        # Configurações (Pydantic Settings)
      database.py      # Engine + sessão + init_db
      deps.py          # Dependências (sessão, usuário autenticado)
      security.py      # Hash de senha + JWT
    models/            # Tabelas SQLModel (User, Classroom, LessonPlan, Grade)
    schemas/           # Schemas Pydantic (request/response)
    services/          # Lógica de negócio
    routers/           # Endpoints HTTP
    main.py            # App FastAPI + CORS + lifespan
  requirements.txt
  .env.example
```

## Setup

```powershell
# Na raiz do projeto:
.\.venv\Scripts\pip.exe install -r backend\requirements.txt

# (Opcional) copiar e ajustar variáveis de ambiente
Copy-Item backend\.env.example backend\.env
```

## Rodar

```powershell
# Na raiz do projeto:
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000 --app-dir backend
```

A API sobe em `http://127.0.0.1:8000`.

- Docs interativas (Swagger): http://127.0.0.1:8000/docs
- Docs alternativas (ReDoc): http://127.0.0.1:8000/redoc

## Endpoints

### Autenticação (`/api/auth`)

| Método | Rota                  | Descrição                                 |
| ------ | --------------------- | ----------------------------------------- |
| POST   | `/api/auth/signup`    | Criar conta — retorna token + usuário     |
| POST   | `/api/auth/login`     | Login — retorna token + usuário           |
| GET    | `/api/auth/me`        | Dados do usuário autenticado              |
| POST   | `/api/auth/forgot-password` | Solicitar redefinição de senha      |
| POST   | `/api/auth/reset-password`  | Redefinir senha com token do link   |

### Mapa de Sala (`/api/classrooms`) — requer token

| Método | Rota                          | Descrição                  |
| ------ | ----------------------------- | -------------------------- |
| GET    | `/api/classrooms`             | Listar turmas do usuário   |
| POST   | `/api/classrooms`             | Criar turma                |
| GET    | `/api/classrooms/{id}`        | Detalhar turma             |
| PATCH  | `/api/classrooms/{id}`        | Atualizar turma            |
| DELETE | `/api/classrooms/{id}`        | Remover turma              |

### Planejamento de Aula (`/api/lesson-plans`) — requer token

| Método | Rota                            | Descrição                |
| ------ | ------------------------------- | ------------------------ |
| GET    | `/api/lesson-plans`             | Listar planos            |
| POST   | `/api/lesson-plans`             | Criar plano              |
| GET    | `/api/lesson-plans/{id}`        | Detalhar plano           |
| PATCH  | `/api/lesson-plans/{id}`        | Atualizar plano          |
| DELETE | `/api/lesson-plans/{id}`        | Remover plano            |

### Notas (`/api/grades`) — requer token

| Método | Rota                       | Descrição                              |
| ------ | -------------------------- | -------------------------------------- |
| GET    | `/api/grades?subject=...`  | Listar notas (filtro opcional)         |
| GET    | `/api/grades/stats`        | Estatísticas (aprovados/reprovados)    |
| POST   | `/api/grades`              | Lançar nota                            |
| PATCH  | `/api/grades/{id}`         | Atualizar nota                         |
| DELETE | `/api/grades/{id}`         | Remover nota                           |

## Autenticação

Todas as rotas (exceto `/`, `/health`, `/docs`, `/api/auth/signup` e `/api/auth/login`) exigem o header:

```
Authorization: Bearer <token>
```

O token é retornado no `signup` e `login` no campo `access_token`.

## Notas

- O banco SQLite (`backend/database.db`) é criado automaticamente no startup.
- Os dados são isolados por usuário (`owner_id`): cada professor só vê os próprios registros.
- Em produção, gere um `SECRET_KEY` forte (`python -c "import secrets; print(secrets.token_urlsafe(64))"`).

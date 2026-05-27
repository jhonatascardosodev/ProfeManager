<div align="center">

# PROFM — ProfeManager

**Plataforma web para o professor organizar sala de aula, planejar aulas e acompanhar o desempenho dos alunos.**

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Python](https://img.shields.io/badge/Backend-Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

[Começar agora](#-início-rápido) · [Funcionalidades](#-funcionalidades) · [Rotas](#-rotas) · [Estrutura](#-estrutura-do-projeto)

</div>

---

## Sobre o projeto

O **PROFM (ProfeManager)** centraliza tarefas do dia a dia do professor em uma interface moderna, com identidade visual em tons de roxo e módulos independentes acessados pelo painel principal.

| | |
|---|---|
| **Público-alvo** | Professores da educação básica e média |
| **Objetivo** | Reduzir trabalho manual em organização de turma, planejamento e notas |
| **Estado atual** | Demonstração funcional com persistência no navegador |

---

## Funcionalidades

<table>
  <tr>
    <th>Módulo</th>
    <th>Rota</th>
    <th>O que faz</th>
  </tr>
  <tr>
    <td>🔐 Autenticação</td>
    <td><code>/entrar</code> · <code>/criar-conta</code></td>
    <td>Login e cadastro com boas-vindas personalizadas</td>
  </tr>
  <tr>
    <td>🏠 Painel</td>
    <td><code>/boas-vindas</code></td>
    <td>Hub de serviços com mensagem <em>“Seja bem-vindo, professor [nome]!”</em></td>
  </tr>
  <tr>
    <td>🪑 Mapa de Sala</td>
    <td><code>/mapa-sala</code></td>
    <td>Matéria, alunos e regras de assento (separado, duplas ou aleatório)</td>
  </tr>
  <tr>
    <td>📅 Planejamento</td>
    <td><code>/planejamento-aula</code></td>
    <td>Assunto, livros, materiais, metodologia e avaliação</td>
  </tr>
  <tr>
    <td>📊 Notas</td>
    <td><code>/notas-desempenho</code></td>
    <td>Lançamento de notas, média automática e situação do aluno</td>
  </tr>
</table>

<details>
<summary><strong>Ver detalhes de cada módulo</strong></summary>

<br>

### Mapa de Sala
- Definição de matéria, quantidade de alunos e fileiras
- Modos: **separado**, **em duplas** ou **aleatório**
- Visualização em grade de carteiras

### Planejamento de Aula
- Informações gerais: disciplina, turma, data e duração
- Conteúdo: assunto e objetivos de aprendizagem
- Materiais: livros didáticos e recursos complementares
- Metodologia, avaliação e observações
- Lista de planejamentos salvos (editar / excluir)

### Notas e Desempenho
- Provas, trabalho e participação (escala **0 a 10**)
- Média calculada automaticamente
- Situação: **Aprovado** · **Recuperação** · **Reprovado**
- Painel com média da turma, maior/menor nota e contadores
- Filtros por disciplina e turma

</details>

---

## Fluxo da aplicação

```mermaid
flowchart LR
  A[Login] --> B[Painel]
  B --> C[Mapa de Sala]
  B --> D[Planejamento]
  B --> E[Notas]
```

---

## Início rápido

### 1. Pré-requisitos

- [Node.js](https://nodejs.org/) **18+**
- [pnpm](https://pnpm.io/) **10+** (recomendado)

### 2. Instalação e execução

```bash
pnpm install
pnpm dev
```

Acesse: **http://localhost:5173/**

### 3. Entrar no sistema (modo demo)

> O login atual é demonstrativo — qualquer e-mail e senha preenchidos permitem acesso.

| Campo | Exemplo |
|-------|---------|
| E-mail | `professor@exemplo.com` |
| Senha | `123456` |

No **cadastro**, o nome informado aparece na mensagem de boas-vindas.

---

## Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Servidor de desenvolvimento com hot reload |
| `pnpm build` | Build de produção |
| `pnpm preview` | Pré-visualização do build |
| `pnpm lint` | Análise estática com ESLint |

---

## Backend (opcional)

API simples em Python para health check e listagem de usuários:

```bash
cd backend
python app.py
```

Endpoints: `/` · `/health` · `/users` — configuração em `backend/config.py`.

---

## Estrutura do projeto

```
projetos 2026/
│
├── src/
│   ├── assets/logos/       # Identidade visual PROFM
│   ├── components/         # Layout e shell (AuthShell)
│   ├── lib/                # Sessão do usuário
│   ├── pages/              # Telas por rota
│   ├── types/              # Tipos (notas, planejamento)
│   ├── App.tsx             # Rotas
│   └── App.css / index.css # Estilos
│
├── backend/                # API Python (opcional)
├── public/
└── package.json
```

---

## Rotas

| Caminho | Página |
|---------|--------|
| `/` | Redireciona para login |
| `/entrar` | Login |
| `/criar-conta` | Cadastro |
| `/esqueci-senha` | Recuperação de senha |
| `/boas-vindas` | Painel de serviços |
| `/mapa-sala` | Mapa de sala |
| `/planejamento-aula` | Planejamento de aula |
| `/notas-desempenho` | Notas e desempenho |

---

## Persistência local

Os dados ficam no `localStorage` do navegador:

| Chave | Armazena |
|-------|----------|
| `profemanager:user` | Nome e e-mail do professor |
| `profemanager:lesson-plans` | Planejamentos de aula |
| `profemanager:grades` | Notas e registros de alunos |

---

## Stack técnica

| Camada | Tecnologia |
|--------|------------|
| UI | React 19 + TypeScript |
| Build | Vite 8 |
| Rotas | React Router 7 |
| Estilo | CSS customizado (tema roxo) |
| API | Python `http.server` (opcional) |

---

<div align="center">

**PROFM** — feito para simplificar a rotina do professor.

*Projeto privado · uso educacional e demonstração*

</div>

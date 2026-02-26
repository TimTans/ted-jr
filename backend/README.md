# Neighborly Backend

FastAPI backend for the Neighborly grocery price comparison and route optimizer.

## Requirements

- Python 3.14+
- [uv](https://docs.astral.sh/uv/) (package manager)

## Setup

1. Install dependencies:
   ```bash
   uv sync
   ```

2. Copy the environment template and fill in your values:
   ```bash
   cp .env.example .env
   ```

## Running

```bash
uv run uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.

- Interactive docs (Swagger): `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`
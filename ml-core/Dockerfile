# ─── ML Core (FastAPI + Python) ──────────────────────────
FROM python:3.11-slim AS ml-core

WORKDIR /app/ml-core
COPY ml-core/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY ml-core/ .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# Render (Docker) — FastAPI portfolio API
# Blueprint: render.yaml → portfolio-api | health: /api/health
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PORT=8080

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --upgrade pip \
    && pip install -r requirements.txt \
    && pip install --no-cache-dir "greenlet>=3.1.0" "email-validator>=2.1.0" \
    && python -c "import greenlet, email_validator, sqlalchemy; from pydantic import EmailStr; print('deps-ok')"

COPY app ./app

# Non-root user
RUN useradd --create-home --uid 10001 appuser \
    && chown -R appuser:appuser /app
USER appuser

EXPOSE 8080

# Render PORT enjekte eder
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080} --proxy-headers --forwarded-allow-ips='*'"]

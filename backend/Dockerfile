# SnapDeploy / container entry for FastAPI portfolio API
# Dashboard: root directory = backend, port = 8080, size = Small (free)
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
    && pip install --no-cache-dir "greenlet>=3.1.0" \
    && python -c "import greenlet; import sqlalchemy; print('deps-ok', greenlet.__version__)"

COPY app ./app

# Non-root user
RUN useradd --create-home --uid 10001 appuser \
    && chown -R appuser:appuser /app
USER appuser

EXPOSE 8080

# Host (SnapDeploy) PORT enjekte eder — service port = 8080
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080} --proxy-headers --forwarded-allow-ips='*'"]

# Multi-stage build for backend - Optimized for EC2
FROM python:3.12-alpine AS builder

WORKDIR /app

# Install build dependencies including g++ for C++ compilation
RUN apk add --no-cache --virtual .build-deps \
    gcc \
    g++ \
    musl-dev \
    linux-headers \
    libffi-dev

COPY requirements.txt .

# Build wheels in isolated stage
RUN pip install --no-cache-dir --user -r requirements.txt


# Final lightweight runtime stage
FROM python:3.12-alpine

WORKDIR /app

# Install runtime dependencies including C++ standard library
RUN apk add --no-cache \
    libffi \
    libssl3 \
    ca-certificates \
    libstdc++ \
    gcompat

# Copy only Python packages from builder
COPY --from=builder /root/.local /root/.local

# Set PATH to use local pip packages
ENV PATH=/root/.local/bin:$PATH \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

COPY . .

EXPOSE 8000

# Run with production server settings
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
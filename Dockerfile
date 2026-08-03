# syntax=docker/dockerfile:1

# --- Stage 1: Build Skillflow web ---
FROM node:22-bookworm-slim AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

# Enable the pnpm version defined in the root package.json
RUN corepack enable

# Copy dependency files first for better Docker caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Download packages using only the lockfile
RUN pnpm fetch

# Copy the remaining monorepo
COPY . .

# Install the exact locked dependencies
RUN pnpm install --offline --frozen-lockfile

# Build only the Skillflow web application
RUN pnpm turbo run build --filter=@skillflow/web

# --- Stage 2: Serve static production files ---
FROM nginxinc/nginx-unprivileged:stable-alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder \
  /app/apps/web/dist \
  /usr/share/nginx/html

USER 101

EXPOSE 8080

HEALTHCHECK \
  --interval=30s \
  --timeout=3s \
  --start-period=10s \
  --retries=3 \
  CMD wget -q -O - http://127.0.0.1:8080/ > /dev/null || exit 1
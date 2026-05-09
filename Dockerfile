# ── Estágio de build ─────────────────────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app

# Copia apenas os manifests primeiro (melhor uso de cache)
COPY package*.json ./
RUN npm ci --only=production

# ── Estágio de runtime ────────────────────────────────────────
FROM node:18-alpine

WORKDIR /app

# Copia dependências já instaladas
COPY --from=builder /app/node_modules ./node_modules

# Copia o código-fonte
COPY app.js ./
COPY src/ ./src/

# Usuário não-root por segurança
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

# Health check para o Docker saber se o container está saudável
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/posts || exit 1

CMD ["node", "app.js"]

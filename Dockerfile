# syntax=docker/dockerfile:1

# Build stage: install dependencies and create Vite production bundle
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage: only production deps + built assets
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/backend ./backend

EXPOSE 5000
CMD ["node", "backend/server.cjs"]

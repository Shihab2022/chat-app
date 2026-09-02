# Stage 1: Build TypeScript Application
FROM node:20-alpine AS builder
WORKDIR /app
COPY back-end/package*.json ./
RUN npm ci
COPY back-end/ ./
RUN npm run build

# Stage 2: Production Execution Environment
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY back-end/package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist

EXPOSE 5000
CMD ["node", "dist/src/app.js"]
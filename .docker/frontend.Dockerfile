# Stage 1: Build Vite Bundle with Environment Variables
FROM node:20-alpine AS builder
WORKDIR /app

# Accept Build Arguments from Docker Compose / GitHub Actions
ARG VITE_BASE_API_URL
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_CALL_ENABLED
ARG VITE_CALL_RING_TIMEOUT_MS
ARG VITE_STUN_SERVERS
ARG VITE_TURN_URL
ARG VITE_TURN_USERNAME
ARG VITE_TURN_CREDENTIAL

# Expose build args to npm run build process
ENV VITE_BASE_API_URL=$VITE_BASE_API_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_CALL_ENABLED=$VITE_CALL_ENABLED
ENV VITE_CALL_RING_TIMEOUT_MS=$VITE_CALL_RING_TIMEOUT_MS
ENV VITE_STUN_SERVERS=$VITE_STUN_SERVERS
ENV VITE_TURN_URL=$VITE_TURN_URL
ENV VITE_TURN_USERNAME=$VITE_TURN_USERNAME
ENV VITE_TURN_CREDENTIAL=$VITE_TURN_CREDENTIAL

COPY front-end/package*.json ./
RUN npm ci
COPY front-end/ ./
RUN npm run build

# Stage 2: Serve Static Bundle via Nginx
FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY .docker/frontend-nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
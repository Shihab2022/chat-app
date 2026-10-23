# Public load balancer / reverse proxy (nginx).
# Serves the frontend SPA, proxies REST (/api/*) and Socket.IO (/socket.io/*)
# to the internal backend, and enables WebSocket upgrade handling.
FROM nginx:alpine AS runner

# loadbalancer-nginx.conf is a full nginx config (events/http/server),
# so it must be installed as the main config file, not a conf.d snippet.
COPY .docker/loadbalancer-nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
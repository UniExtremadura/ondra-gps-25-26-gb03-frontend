# ============================================
# STAGE 1: Build
# ============================================
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build -- --configuration production

# ============================================
# STAGE 2: Runtime con Nginx
# ============================================
FROM nginx:1.25-alpine

LABEL maintainer="ondra-team"
LABEL service="frontend"
LABEL version="1.0.0"

# Copiar archivos compilados
COPY --from=build /app/dist/ondra-frontend/browser /usr/share/nginx/html

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar script de inicio (desde el contexto de build)
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Crear directorio para config si no existe
RUN mkdir -p /usr/share/nginx/html/assets

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Usar entrypoint personalizado
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

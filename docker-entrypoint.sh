#!/bin/sh

# Valores por defecto
API_USUARIOS_URL=${API_USUARIOS_URL:-http://localhost:8080}
API_CONTENIDOS_URL=${API_CONTENIDOS_URL:-http://localhost:8081}
API_RECOMENDACIONES_URL=${API_RECOMENDACIONES_URL:-http://localhost:8082}

# Crear archivo de configuración JavaScript
cat <<EOF > /usr/share/nginx/html/assets/config.js
window.ENV = {
  apiUsuariosUrl: '${API_USUARIOS_URL}',
  apiContenidosUrl: '${API_CONTENIDOS_URL}',
  apiRecomendacionesUrl: '${API_RECOMENDACIONES_URL}'
};
EOF

echo "✅ Variables de entorno configuradas:"
echo "   - API_USUARIOS_URL: ${API_USUARIOS_URL}"
echo "   - API_CONTENIDOS_URL: ${API_CONTENIDOS_URL}"
echo "   - API_RECOMENDACIONES_URL: ${API_RECOMENDACIONES_URL}"

# Ejecutar comando original (nginx)
exec "$@"

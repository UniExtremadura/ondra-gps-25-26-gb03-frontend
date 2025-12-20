/**
 * Configuración de entorno para desarrollo
 */
export const environment = {
  /** Indica si la aplicación está en modo producción */
  production: false,

  /**
   * Control de modo de datos
   * true  = utiliza datos mock
   * false = utiliza los microservicios reales
   */
  useMock: false,

  /** URLs base de los microservicios */
  apis: {
    /** Microservicio de Usuarios */
    usuarios: '/api',
    /** Microservicio de Contenidos */
    contenidos: '/api',
    /** Microservicio de Recomendaciones */
    recomendaciones: '/api'
  },

  /** Nombre de la aplicación */
  appName: 'ONDRA',

  /** Versión de la aplicación */
  version: '1.0.0'
};

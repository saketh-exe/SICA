/**
 * Environment configuration utility
 * Handles backend URL selection based on environment
 */

const getBackendUrl = (): string => {
  const environment = import.meta.env.VITE_ENVIRONMENT;
  const prodUrl = import.meta.env.VITE_BACKEND_URL_PROD;
  const devUrl = import.meta.env.VITE_BACKEND_URL_DEV;

  if (environment === 'PRODUCTION') {
    return prodUrl || 'https://backend-1062324875159.asia-south2.run.app';
  } else {
    return devUrl || 'http://localhost:3000';
  }
};

export const config = {
  backendUrl: getBackendUrl(),
  environment: import.meta.env.VITE_ENVIRONMENT || 'DEVELOPMENT',
  isDevelopment: import.meta.env.VITE_ENVIRONMENT !== 'PRODUCTION',
  isProduction: import.meta.env.VITE_ENVIRONMENT === 'PRODUCTION'
};

export default config;
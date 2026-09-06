export const getApiUrl = () => {
  const configuredApiUrl = import.meta.env.VITE_API_URL;
  if (configuredApiUrl) {
    return configuredApiUrl.replace(/\/$/, '');
  }

  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8000/api';
  }

  return 'https://ats-website-ats.up.railway.app/api';
};

export const API_URL = getApiUrl();
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');


export const getApiUrl = () => {
  // Get the current hostname
  const hostname = window.location.hostname;
  
  console.log('📍 Current hostname:', hostname);
  
  // If we're on Railway (production)
  if (hostname.includes('railway.app') || hostname.includes('railway')) {
    const railwayUrl = 'https://ats-website-production.up.railway.app/api';
    console.log('🚀 Using Railway backend:', railwayUrl);
    return railwayUrl;
  }
  
  // If we're on localhost (development)
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    const localUrl = 'http://localhost:8000/api';
    console.log('💻 Using local backend:', localUrl);
    return localUrl;
  }
  
  // Check for environment variable (fallback)
  if (import.meta.env.VITE_API_URL) {
    console.log('📦 Using env variable:', import.meta.env.VITE_API_URL);
    return import.meta.env.VITE_API_URL;
  }
  
  // Default fallback
  console.log('⚠️ Using default fallback: http://localhost:8000/api');
  return 'http://localhost:8000/api';
};

export const API_URL = getApiUrl();

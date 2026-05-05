// تحديد عنوان API بناءً على بيئة التشغيل
export const getApiUrl = () => {
  // إذا كنا في بيئة التطوير (Local)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('📍 Local environment - using localhost:8000');
    return 'http://localhost:8000/api';
  }
  
  // إذا كنا في بيئة Railway (Production)
  if (window.location.hostname.includes('railway.app')) {
    // استخدم عنوان الباك إند على Railway
    // يجب تغيير هذا الرابط إلى رابط الباك إند الفعلي الخاص بك
    const railwayBackend = 'https://ats-website-production.up.railway.app';
    console.log('🚀 Railway environment - using:', railwayBackend);
    return `${railwayBackend}/api`;
  }
  
  // افتراضي (للتجربة)
  console.log('⚠️ Unknown environment - using default');
  return 'http://localhost:8000/api';
};

export const API_URL = getApiUrl();
console.log('🔧 API_URL:', API_URL);

// Configuration file for environment variables
const config = {
  backendUrl: process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000',
  googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
  googleMapId: process.env.REACT_APP_GOOGLE_MAP_ID || '',
};

// Detailed debugging
console.log('🔧 Environment Variables Debug:', {
  // Raw environment variables
  REACT_APP_BACKEND_URL: process.env.REACT_APP_BACKEND_URL,
  REACT_APP_GOOGLE_MAPS_API_KEY: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  REACT_APP_GOOGLE_MAP_ID: process.env.REACT_APP_GOOGLE_MAP_ID,
  
  // Process object
  hasProcess: typeof process !== 'undefined',
  hasProcessEnv: typeof process !== 'undefined' && !!process.env,
  
  // Config values
  configBackendUrl: config.backendUrl,
  configGoogleMapsKey: config.googleMapsApiKey,
  configGoogleMapId: config.googleMapId,
  
  // Boolean checks
  hasGoogleMapsKey: !!config.googleMapsApiKey,
  hasGoogleMapId: !!config.googleMapId,
});

export default config; 
// Configuration file for environment variables
const config = {
  // Temporary hardcoded backend URL for testing
  backendUrl: 'https://backend-production-78324.up.railway.app',
  googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
  googleMapId: process.env.REACT_APP_GOOGLE_MAP_ID || '',
};

// Log the backend URL for debugging
console.log('🔧 Frontend Config:', {
  backendUrl: config.backendUrl,
  hasGoogleMapsKey: !!config.googleMapsApiKey,
  hasGoogleMapId: !!config.googleMapId,
  envBackendUrl: process.env.REACT_APP_BACKEND_URL,
});

export default config; 
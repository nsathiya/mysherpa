// Configuration file for environment variables
const config = {
  backendUrl: process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000',
  
  // Google Maps configuration
  googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
  googleMapId: process.env.REACT_APP_GOOGLE_MAP_ID || '',
};

export default config; 
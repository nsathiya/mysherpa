# Personal Concierge Frontend

A React-based frontend for the Personal Concierge MVP that provides a personalized activity recommendation experience.

## Features

- 🔐 Firebase Authentication (Google SSO + Email/Password)
- 🎯 Multi-step onboarding flow
- 🗺️ Interactive Google Maps integration
- 📧 Email sharing functionality
- ⭐ Suggestion ratings and feedback
- 📱 Responsive design
- 🎨 Modern UI/UX

## Environment Setup

Create a `.env` file in the frontend directory:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# Backend API URL
REACT_APP_API_URL=http://localhost:3000

# Google Maps
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
REACT_APP_GOOGLE_MAPS_MAP_ID=your_map_id
```

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Production Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Set environment variables** in Vercel dashboard

### Option 2: Netlify

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Deploy** by dragging the `build` folder to Netlify

3. **Set environment variables** in Netlify dashboard

### Option 3: GitHub Pages

1. **Add homepage to package.json:**
   ```json
   {
     "homepage": "https://yourusername.github.io/your-repo-name"
   }
   ```

2. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Add deploy scripts:**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```

### Option 4: AWS S3 + CloudFront

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Upload to S3 bucket**

3. **Configure CloudFront distribution**

## Firebase Setup

1. **Create Firebase project** at [console.firebase.google.com](https://console.firebase.google.com)

2. **Enable Authentication:**
   - Google Sign-in
   - Email/Password

3. **Get configuration** from Project Settings > General > Your apps

4. **Add authorized domains** for your production domain

## Google Maps Setup

1. **Create Google Cloud project**

2. **Enable APIs:**
   - Maps JavaScript API
   - Geocoding API
   - Places API

3. **Create API key** with appropriate restrictions

4. **Create Map ID** in Google Cloud Console

## Environment Variables for Production

Update your production environment variables:

```env
# Production Backend URL
REACT_APP_API_URL=https://your-backend-domain.com

# Production Firebase config
REACT_APP_FIREBASE_API_KEY=your_production_firebase_key
# ... other Firebase config

# Production Google Maps
REACT_APP_GOOGLE_MAPS_API_KEY=your_production_maps_key
REACT_APP_GOOGLE_MAPS_MAP_ID=your_production_map_id
```

## Performance Optimization

- ✅ Code splitting with React.lazy()
- ✅ Optimized images and assets
- ✅ Service worker for caching
- ✅ Bundle analysis with `npm run build --analyze`

## Security Considerations

- ✅ Environment variables for sensitive data
- ✅ Firebase security rules
- ✅ HTTPS in production
- ✅ Content Security Policy headers
- ✅ API key restrictions

## User Experience Features

- **Onboarding Flow:** Multi-step preference collection
- **Personalization:** Tailored suggestions based on user preferences
- **Interactive Maps:** Visual location display
- **Email Sharing:** Easy suggestion sharing
- **Rating System:** User feedback collection
- **Responsive Design:** Works on all devices

## Analytics & Monitoring

Consider adding:

- **Google Analytics:** Track user behavior
- **Sentry:** Error monitoring
- **Hotjar:** User session recordings
- **Custom events:** Track feature usage

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## Build Optimization

The app is optimized for production with:

- Minified JavaScript and CSS
- Optimized images
- Tree shaking
- Dead code elimination
- Service worker for offline support 
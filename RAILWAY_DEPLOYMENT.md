# 🚀 Railway Deployment Checklist

## Pre-Deployment Setup

### 1. Repository Preparation ✅
- [x] Backend Railway config (`backend/railway.json`)
- [x] Frontend Railway config (`frontend/railway.json`)
- [x] Backend binds to `0.0.0.0` for Railway compatibility
- [x] Frontend build and serve scripts configured

### 2. Environment Variables Checklist

#### Backend Environment Variables
```
DATABASE_URL=your-postgresql-connection-string
NODE_ENV=production
OPENAI_API_KEY=your-openai-api-key
BREVO_API_KEY=your-brevo-api-key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
FRONTEND_URL=https://your-frontend-railway-url.railway.app
```

#### Frontend Environment Variables
```
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
REACT_APP_GOOGLE_MAP_ID=your-google-map-id
REACT_APP_BACKEND_URL=https://your-backend-railway-url.railway.app
```

## Deployment Steps

### Step 1: Create Railway Project
1. [ ] Go to [railway.app](https://railway.app)
2. [ ] Sign in with GitHub
3. [ ] Click "New Project"
4. [ ] Select "Deploy from GitHub repo"
5. [ ] Choose `concierge-mvp` repository

### Step 2: Deploy Backend
1. [ ] Click "Add Service" → "GitHub Repo"
2. [ ] Set Root Directory to: `backend`
3. [ ] Click "Deploy"
4. [ ] Wait for deployment to complete
5. [ ] Copy the generated URL (e.g., `https://backend-production-1234.railway.app`)

### Step 3: Deploy Frontend
1. [ ] In the same project, click "Add Service" again
2. [ ] Select "GitHub Repo" (same repo)
3. [ ] Set Root Directory to: `frontend`
4. [ ] Click "Deploy"
5. [ ] Wait for deployment to complete
6. [ ] Copy the generated URL (e.g., `https://frontend-production-5678.railway.app`)

### Step 4: Configure Environment Variables

#### Backend Service Variables
1. [ ] Go to Backend service settings
2. [ ] Click "Variables" tab
3. [ ] Add each environment variable:
   - [ ] `DATABASE_URL` (Railway PostgreSQL connection string)
   - [ ] `NODE_ENV=production`
   - [ ] `OPENAI_API_KEY`
   - [ ] `BREVO_API_KEY`
   - [ ] `GOOGLE_MAPS_API_KEY`
   - [ ] `FRONTEND_URL` (use frontend Railway URL)

#### Frontend Service Variables
1. [ ] Go to Frontend service settings
2. [ ] Click "Variables" tab
3. [ ] Add each environment variable:
   - [ ] `REACT_APP_GOOGLE_MAPS_API_KEY`
   - [ ] `REACT_APP_GOOGLE_MAP_ID`
   - [ ] `REACT_APP_BACKEND_URL` (use backend Railway URL)

### Step 5: Test Deployment
1. [ ] Test Backend Health Check: `https://backend-url.railway.app/health`
2. [ ] Test Frontend: `https://frontend-url.railway.app`
3. [ ] Test API Communication between frontend and backend
4. [ ] Test authentication flow
5. [ ] Test suggestion generation

## Troubleshooting

### Common Issues
- **502 Error**: Check Railway logs, ensure app binds to `0.0.0.0`
- **CORS Error**: Verify `FRONTEND_URL` is set correctly in backend
- **Database Connection**: Ensure `DATABASE_URL` is properly formatted
- **Build Failures**: Check Railway build logs for dependency issues

### Railway Logs
- Go to service → "Deployments" → Click on deployment → "Logs"
- Look for error messages and stack traces

## Post-Deployment

### 1. Custom Domains (Optional)
- [ ] Add custom domain in Railway settings
- [ ] Update DNS records
- [ ] Update environment variables with new URLs

### 2. Monitoring
- [ ] Set up Railway monitoring
- [ ] Configure error alerts
- [ ] Monitor application performance

### 3. Database Setup
- [ ] Add PostgreSQL service in Railway (if not using external DB)
- [ ] Run database migrations
- [ ] Test database connectivity

## Success Criteria
- [ ] Backend responds to health check
- [ ] Frontend loads without errors
- [ ] Authentication works
- [ ] Suggestions are generated
- [ ] Email sharing works
- [ ] No CORS errors in browser console

## Cost Estimation
- **Railway**: ~$5-20/month for both services
- **Database**: ~$5-15/month (if using Railway PostgreSQL)
- **Total**: ~$10-35/month

---

**Need Help?** Check Railway documentation or contact Railway support. 
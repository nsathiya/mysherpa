# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Accept build arguments for environment variables
ARG REACT_APP_BACKEND_URL
ARG REACT_APP_GOOGLE_MAPS_API_KEY
ARG REACT_APP_GOOGLE_MAP_ID

# Set environment variables for build
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
ENV REACT_APP_GOOGLE_MAPS_API_KEY=$REACT_APP_GOOGLE_MAPS_API_KEY
ENV REACT_APP_GOOGLE_MAP_ID=$REACT_APP_GOOGLE_MAP_ID

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Install serve globally
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Start the application
CMD ["sh", "-c", "serve -s build -l ${PORT:-3000}"] 
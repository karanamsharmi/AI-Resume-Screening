# Multi-stage build for React - Optimized for EC2
# Stage 1: Builder - Install dependencies and build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (npm ci is faster and more reliable than npm install)
RUN npm ci --only=production && \
    npm cache clean --force

# Copy source code
COPY . .

# Build React application
RUN npm run build


# Stage 2: Runtime - Lightweight server to serve built files
FROM node:20-alpine

WORKDIR /app

# Install only serve package for production (lightweight alternative to npm start)
RUN npm install -g serve@14 && npm cache clean --force

# Copy only the built application from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public

# Set environment variables
ENV NODE_ENV=production \
    REACT_APP_API_URL=http://localhost:8000

EXPOSE 3000

# Serve the built application (faster and lighter than npm start)
CMD ["serve", "-s", "build", "-l", "3000"]
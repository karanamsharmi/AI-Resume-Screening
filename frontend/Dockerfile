# Multi-stage build for React - Optimized for EC2
# Stage 1: Builder - Install dependencies and build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies needed for build)
# The --omit=dev was causing the build to fail
RUN npm install && \
    npm cache clean --force

# Copy source code (this will include public and src folders)
COPY . .

# Build React application
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL:-http://localhost:8000}
RUN npm run build

# Debug: verify build output exists
RUN ls -la /app/build && ls -la /app/build/static

# Stage 2: Runtime - Lightweight server to serve built files
FROM node:20-alpine

WORKDIR /app

# Install only serve package for production
RUN npm install -g serve@14 && npm cache clean --force

# Copy only the built application from builder
COPY --from=builder /app/build ./build

# Set environment variables
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

# Serve the built application
CMD ["serve", "-s", "build", "-l", "3000"]
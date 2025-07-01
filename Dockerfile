FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY src/ ./src/
COPY webpack.config.js .prettierrc ./

RUN npm run build
FROM node:22-alpine AS production
RUN npm install -g http-server && \
    addgroup -g 1001 -S nodejs && \
    adduser -S myapp -u 1001 && \
    mkdir -p /app && \
    chown -R myapp:nodejs /app
USER myapp
WORKDIR /app
COPY --from=builder --chown=myapp:nodejs /app/dist ./
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1
    
CMD ["http-server", ".", "-p", "8080", "-c-1", "--cors"]
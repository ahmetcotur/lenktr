FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build
FROM node:22-alpine
ENV NODE_ENV=production PORT=80 UPLOAD_DIR=/app/data/uploads
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps && mkdir -p /app/data/uploads && chown -R node:node /app
COPY --from=builder /app/dist ./dist
COPY server ./server
USER node
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s CMD node -e "fetch('http://127.0.0.1:80/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server/index.js"]

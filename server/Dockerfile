# ─── Backend (Express.js) ────────────────────────────────────
FROM node:18-alpine AS backend

WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --production
COPY server/ .

EXPOSE 3000
CMD ["node", "src/server.js"]

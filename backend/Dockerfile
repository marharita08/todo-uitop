FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
COPY backend/package*.json ./backend/
RUN npm install --workspace=backend

COPY backend ./backend
WORKDIR /app/backend

RUN npx prisma generate
RUN npm run build
RUN npm prune --omit=dev
RUN mkdir -p ./db

EXPOSE ${BACKEND_PORT}

CMD ["sh", "-c", "npx prisma migrate deploy && npx ts-node prisma/seed.ts && node dist/src/main.js"]

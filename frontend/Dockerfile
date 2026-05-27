FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
COPY frontend/package*.json ./frontend/
RUN npm install --workspace=frontend

COPY frontend ./frontend
WORKDIR /app/frontend

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN npm run build
RUN npm prune --omit=dev

EXPOSE ${FRONTEND_PORT}

CMD ["sh", "-c", "npm run start -- -p ${FRONTEND_PORT}"]

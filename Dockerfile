FROM node:18-alpine

WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm install

# Copy backend and frontend
COPY api ./api
COPY web ./web

EXPOSE 4000

CMD ["node", "api/index.js"]

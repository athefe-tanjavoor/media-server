FROM node:18

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy project files
COPY . .

# Expose port
EXPOSE 4000

# Start server
CMD ["node", "index.js"]

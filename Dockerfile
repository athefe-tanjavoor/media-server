FROM node:18

WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./
RUN npm install --production

# Copy the rest of the project files
COPY . .

# Expose port
EXPOSE 4000

# Run Node.js app
CMD ["node", "index.js"]

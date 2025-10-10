FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy project files
COPY . .

# Expose port
EXPOSE 4000

# Start the server
CMD ["node", "index.js"]

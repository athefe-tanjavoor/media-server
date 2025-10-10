# Use Node.js LTS image
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package.json first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app files
COPY . .

# Expose port
EXPOSE 4000

# Start app directly
CMD ["node", "index.js"]

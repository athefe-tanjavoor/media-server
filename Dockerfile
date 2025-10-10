FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all project files
COPY . .

# Ensure uploads folder exists
RUN mkdir -p uploads

# Expose port
EXPOSE 4000

# Start the server
CMD ["node", "index.js"]

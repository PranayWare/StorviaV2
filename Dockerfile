FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only package.json files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy entire project
COPY . .

# Compile and build
RUN npm run build

# Expose port (adjust if your app uses a different port)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]


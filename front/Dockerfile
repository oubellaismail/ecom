# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the files
COPY . .

# Expose React development port
EXPOSE 3000

# Run React dev server
CMD ["npm", "start"]

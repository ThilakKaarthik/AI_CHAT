# Use an official Node.js image as the base
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the project files (including the server.js) into the container
COPY . .

# Build the app

# Expose the port that the app will run on (default for Next.js is 3000)
EXPOSE 3000

# Run the custom server using Node.js (with the correct path to server.js)
CMD ["node", "app/node/server.js"]

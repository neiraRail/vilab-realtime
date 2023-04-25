# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in package.json
RUN npm install

# Expose port 3000 to the outside world
EXPOSE 4000

# Define environment variable
ENV NODE_ENV production

# Start the application
CMD ["node", "server.js"]

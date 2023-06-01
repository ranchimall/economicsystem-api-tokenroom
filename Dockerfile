# Use the Node.js 14 base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Clone the repository
RUN git clone https://github.com/vivekteega/economicsystem-tokenroom .

# Install dependencies
RUN npm install

# Copy sheet_data.json and access_token.json to the "config" folder
COPY $ACCESS_TOKEN_PATH .
COPY $SHEET_DATA_PATH .

# Set the environment variable for the port
ENV PORT=3000

# Expose the port specified in the environment variable
EXPOSE $PORT

# Start the application
ENTRYPOINT ["npm", "start"]

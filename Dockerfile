FROM node:20

# Install system dependencies
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/* # Cleanup

WORKDIR /app

COPY package*.json ./
COPY packages/frontend/package*.json ./packages/frontend/
COPY packages/backend/package*.json ./packages/backend/

RUN npm install -g lerna

RUN npm install

COPY . .

RUN npm run build

# Expose the port the app runs on
EXPOSE 4173

# Set environment variables
ENV NODE_ENV=production

# Command to run the application
CMD ["npm", "start"]
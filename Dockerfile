FROM node:latest

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# If you are building your code for production
RUN npm ci --only=production

# Produtcion
ENV NODE_ENV=production

# Bundle app source
COPY . .

# Port
EXPOSE 3000

# Start
CMD [ "npm", "start" ]

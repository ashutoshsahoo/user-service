FROM node:12-slim

MAINTAINER ashutoshsahoo

LABEL version="1.0.0"

LABEL description="User service"

RUN mkdir -p /usr/app/src

# Copy source code
COPY src /usr/app/src
COPY package.json /usr/app
COPY package-lock.json /usr/app
COPY tsconfig.json /usr/app
COPY .env /usr/app

WORKDIR /usr/app

RUN chown -R node:node /usr/app

# Run as a noon-root user
USER node

RUN npm install

EXPOSE 3000

# Start the process
CMD ["node", "./dist/server.js"]
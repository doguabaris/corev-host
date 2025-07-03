FROM node:20-alpine

WORKDIR /app

# Copy configs and metadata
COPY package*.json ./
COPY tsconfig.json ./
COPY .env ./
COPY packages ./packages
COPY bin ./bin
COPY eslint.config.mjs ./
COPY .prettierrc ./
COPY .editorconfig ./

# Install all deps, including workspaces
RUN npm install

# Build server & dashboard
RUN npm run build

EXPOSE 8080 3001

CMD [ "node", "./dist/corev-host.js" ]

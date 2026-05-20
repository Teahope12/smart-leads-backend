# backend/Dockerfile

FROM node:20-alpine

WORKDIR /app

# Copy everything
COPY . .

# Install dependencies
RUN npm install

# Install ts-node
RUN npm install -g ts-node typescript

EXPOSE 5000

CMD ["ts-node", "server.ts"]
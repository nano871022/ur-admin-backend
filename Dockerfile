FROM node:22-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Expose the port the app runs on
EXPOSE 8080

CMD ["npm", "start"]

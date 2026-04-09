FROM node:20-slim
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 80
CMD ["node", "app.js"]

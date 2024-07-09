FROM node:20.11.0

WORKDIR /blog

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3535

CMD ["node", "server.js"]

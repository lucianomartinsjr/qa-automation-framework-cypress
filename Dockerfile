FROM cypress/included:15.4.0

WORKDIR /e2e

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "test:ci"]

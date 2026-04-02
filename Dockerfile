FROM cypress/included:15.4.0 AS base

WORKDIR /e2e

COPY package*.json ./
RUN npm ci --prefer-offline

FROM base AS runner

COPY . .

ENTRYPOINT ["npm", "run"]
CMD ["test:ci"]

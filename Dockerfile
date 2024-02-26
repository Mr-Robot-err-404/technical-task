FROM node:20-slim

WORKDIR /app

COPY pnpm-lock.yaml package.json ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

EXPOSE 8000

CMD ["pnpm", "start"]
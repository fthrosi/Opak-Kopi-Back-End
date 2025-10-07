FROM node:20-alpine

# install deps needed (bash, netcat)
RUN apk add --no-cache bash netcat-openbsd openssl libstdc++ libgcc

WORKDIR /app

# copy package + prisma schema first for faster installs
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

# copy source
COPY . .

# generate prisma client & build
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

# wait for db then run migrations/seeds and start
CMD ["sh", "-c", "until nc -z db 3306; do echo 'Waiting for db...'; sleep 2; done; echo 'DB is up'; npx prisma migrate deploy && npx prisma db seed || true; node dist/server.js"]
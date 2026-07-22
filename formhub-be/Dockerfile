FROM node:18

RUN npm i -g pnpm@8

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY prisma/schema.prisma ./prisma/
RUN npx prisma generate

COPY . .

EXPOSE 8080
CMD [ "pnpm", "start" ]

FROM node:18-slim AS base

RUN npm i -g pnpm@8

WORKDIR /usr/src/app

COPY pnpm-lock.yaml package.json /usr/src/app/

RUN pnpm install --frozen-lockfile

COPY ./prisma/schema.prisma /usr/src/app/prisma/

RUN pnpm prisma generate

COPY ./src /usr/src/app/src
COPY .swcrc /usr/src/app/
RUN pnpm build

RUN pnpm prune --prod

FROM node:18-slim
WORKDIR /usr/src/app/
ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"
COPY --from=base /usr/src/app/dist ./dist
COPY --from=base /usr/src/app/package.json ./package.json
COPY --from=base /usr/src/app/node_modules ./node_modules

USER node

CMD [ "node", "dist/index.js" ]

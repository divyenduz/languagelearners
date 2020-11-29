FROM node:12.18.4
WORKDIR /app
ADD . .
ADD layers/bin/ffmpeg /usr/bin/ffmpeg

# Required because of a bug in older verson of Prisma
ENV DB_URL=''

RUN yarn && yarn build && yarn prisma2 generate
USER node
EXPOSE 3000
CMD [ "yarn", "server", "--noTimeout" ]

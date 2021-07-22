FROM node:16.5.0
WORKDIR /app
ADD package.json ./package.json
ADD prisma/schema.prisma ./prisma/schema.prisma
RUN yarn && yarn prisma generate
ADD layers/bin/ffmpeg /usr/bin/ffmpeg
ADD . .
RUN yarn build
USER node
EXPOSE 3000
CMD [ "yarn", "start" ]
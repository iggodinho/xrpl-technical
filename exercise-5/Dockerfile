FROM node:24-alpine

WORKDIR /app

COPY package.json ./

RUN yarn install

COPY . .

EXPOSE 8374 

ENV PORT=8374
ENV NITRO_PORT=8374
ENV NITRO_HOST=0.0.0.0

CMD ["yarn", "run", "dev"]
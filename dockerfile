FROM node:16-alpine3.14
WORKDIR /destop/app
COPY . /destop/app
RUN yarn 
CMD ["yarn", "start"]
FROM node:16-alpine as build

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn

COPY . .
RUN yarn build

RUN apk update && apk add dos2unix
RUN dos2unix ./docker/entry.sh

FROM nginx:1.23.3-alpine

COPY --from=build /app/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/docker/entry.sh /entry.sh
RUN chmod +x /entry.sh

ENTRYPOINT ["/entry.sh"]
CMD ["nginx", "-g", "daemon off;"]
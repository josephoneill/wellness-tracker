# syntax=docker/dockerfile:1
FROM node:24-alpine3.22 AS build
WORKDIR /usr/src/app
COPY package*.json /usr/src/app/
ENV NODE_ENV=production
RUN yarn config set registry "http://registry.npmjs.org"
RUN yarn install --frozen-lockfile --no-cache --production --network-timeout 500000 --verbose --no-audit
COPY . /usr/src/app
RUN yarn run build

FROM nginx:1.27.1-alpine
RUN apk add --no-cache dumb-init
RUN  touch /var/run/nginx.pid && \
     chown -R nginx:nginx /var/cache/nginx /var/run/nginx.pid
USER nginx
WORKDIR /usr/src/app
COPY --chown=nginx:nginx --from=build /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["dumb-init", "nginx", "-g", "daemon off;"]
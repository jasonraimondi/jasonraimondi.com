FROM node:16.14.0-alpine3.14 as node

FROM klakegg/hugo:0.81.0-ext-alpine as builder

## Install node and yarn from node image
COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules

RUN apk add --update --no-cache curl \
    && curl -fsSL 'https://github.com/pnpm/pnpm/releases/download/v6.32.2/pnpm-linuxstatic-x64' -o /usr/local/bin/pnpm \
    && chmod +x /usr/local/bin/pnpm

WORKDIR /app

COPY pnpm-lock.yaml package.json /app/
RUN pnpm install --frozen-lockfile --production false
COPY hugo.toml postcss.config.js /app/
COPY assets/ /app/assets/
COPY content/ /app/content/
COPY layouts/ /app/layouts/
COPY static/ /app/static/
COPY taxonomy/ /app/taxonomy/

RUN hugo --source /app --destination /dist --cleanDestinationDir

FROM nginx:alpine
COPY ./nginx /etc/nginx/
COPY --chown=nginx:nginx --from=builder /dist/ /app/

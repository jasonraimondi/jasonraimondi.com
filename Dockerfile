FROM node:12-alpine as node

FROM jojomi/hugo:0.71.0 as builder
## Install node and yarn from node image
COPY --from=node /usr/local/bin/node /usr/local/bin/node
# COPY --from=node /usr/local/package.json /usr/local/package.json
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN \
  ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm && \
  ln -s /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx

WORKDIR /app
COPY package-lock.json package.json /app/
RUN npm ci
COPY assets/ /app/assets/
COPY content/ /app/content/
COPY layouts/ /app/layouts/
COPY static/ /app/static/
COPY taxonomy/ /app/taxonomy/
COPY config.toml /app/

# RUN hugo --source /app --destination /dist --cleanDestinationDir --minify
RUN hugo --source /app --destination /dist --cleanDestinationDir

FROM nginx:alpine
COPY ./nginx /etc/nginx/
COPY --chown=nginx:nginx --from=builder /dist/ /app/

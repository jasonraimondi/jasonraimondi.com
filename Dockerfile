FROM node:12-alpine as node

FROM jojomi/hugo:0.60.1 as builder
## Install node and yarn from node image
COPY --from=node /usr/local/bin/node /usr/local/bin/node
# COPY --from=node /usr/local/package.json /usr/local/package.json
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN \
  ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm && \
  ln -s /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx

WORKDIR /app
RUN apk add --update --no-cache bash git openssh \
    && npm install -g postcss-cli autoprefixer
RUN git clone https://github.com/jasonraimondi/hugo-theme-developer-portfolio.git /app/themes/hugo-theme-developer-portfolio \
    && cd /app/themes/hugo-theme-developer-portfolio \
    && npm ci
COPY ./content/ /app/content/
COPY ./static/ /app/static/
COPY ./config.toml /app/config.toml

# RUN hugo --source /app --destination /dist --cleanDestinationDir --minify
RUN hugo --source /app --destination /dist --cleanDestinationDir

FROM nginx:alpine
COPY ./nginx /etc/nginx/
COPY --chown=nginx:nginx --from=builder /dist/ /app/

FROM node:alpine as node-builder
WORKDIR /app/assets
COPY ./assets/package* /app/assets/
RUN mkdir -p /app/jekyll/assets/js \
    && npm install -q --no-color --no-progress
COPY ./assets/tsconfig* /app/assets/
COPY ./assets/build/ /app/assets/build/
COPY ./assets/settings/ /app/assets/settings/
COPY ./assets/src/ /app/assets/src/
RUN npm run prod

FROM jekyll/builder as builder
WORKDIR /app
COPY ./jekyll/Gemfile* /app/
RUN bundle install
COPY ./jekyll /app/
COPY --from=node-builder /app/jekyll/assets/js /app/assets/js
RUN mkdir -p /app/_site \
    && jekyll build

FROM nginx:alpine
LABEL maintainer="Jason Raimondi <jason@raimondi.us>"
RUN rm -f /etc/nginx/conf.d/* && rm -rf /app/*
COPY --from=builder /app/_site /app
COPY ./nginx /etc/nginx/

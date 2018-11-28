FROM jekyll/builder as builder
RUN apk update && apk add --update nodejs nodejs-npm
WORKDIR /app/jekyll
COPY ./jekyll/Gemfile* /app/jekyll/
RUN bundle install
COPY ./jekyll /app/jekyll/
RUN mkdir -p /app/jekyll/_site && jekyll build

FROM nginx:alpine
LABEL maintainer="Jason Raimondi <jason@raimondi.us>"
RUN rm -f /etc/nginx/conf.d/* && rm -rf /app/*
COPY --from=builder /app/jekyll/_site /app
COPY ./nginx /etc/nginx/

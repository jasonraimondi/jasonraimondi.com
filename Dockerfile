FROM nginx:alpine

RUN rm -f /etc/nginx/conf.d/* && rm -rf /app/*

COPY ./jekyll/_site /app

COPY ./nginx /etc/nginx/

FROM nginx:alpine

RUN rm -f /etc/nginx/conf.d/* && rm -rf /app/*

COPY ./jekyll/_site /app

COPY ./nginx-jasonraimondi.conf /etc/nginx/conf.d/nginx-jasonraimondi.conf

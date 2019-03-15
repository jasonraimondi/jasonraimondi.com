FROM digitalcanvasdesign/hugo-nodejs-builder as builder
WORKDIR /app
COPY ./themes/ /app/themes/
RUN cd /app/themes/jasontheme && npm install
COPY ./content/ /app/content/
COPY ./static/ /app/static/
COPY ./config.toml /app/config.toml
RUN cd /app && hugo --destination /dist --cleanDestinationDir --minify

FROM nginx:alpine
COPY ./nginx /etc/nginx/
COPY --chown=nginx:nginx --from=builder /dist/ /app/

FROM digitalcanvasdesign/hugo-nodejs-builder as builder
WORKDIR /app
COPY ./themes/ /app/themes/
COPY ./content/ /app/content/
COPY ./static/ /app/static/
COPY ./config.toml /app/config.toml
RUN hugo --source /app --destination /dist --cleanDestinationDir

FROM nginx:alpine
COPY ./nginx /etc/nginx/
COPY --chown=nginx:nginx --from=builder /dist/ /app/
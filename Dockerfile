FROM digitalcanvasdesign/hugo-nodejs-builder as builder
WORKDIR /app
COPY .git /app/.git
COPY .gitmodules /app/.gitmodules
RUN apk add --update --no-cache bash git openssh \
    && git submodule update --init \
    && cd /app/themes/hugo-theme-developer-portfolio \
    && npm install
COPY ./content/ /app/content/
COPY ./static/ /app/static/
COPY ./config.toml /app/config.toml
RUN hugo --source /app --destination /dist --cleanDestinationDir --minify

FROM nginx:alpine
COPY ./nginx /etc/nginx/
COPY --chown=nginx:nginx --from=builder /dist/ /app/

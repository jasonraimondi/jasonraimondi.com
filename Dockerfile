    FROM jojomi/hugo as builder
    WORKDIR /app
    RUN apk update && apk upgrade \
        && apk add --no-cache bash git openssh \
        && git clone --depth=1 https://github.com/siegerts/hugo-theme-basic.git /app/themes/hugo-theme-basic \
        && rm -rf /app/themes/hugo-theme-basic/.git
    COPY ./layouts/ /app/layouts/
    COPY ./content/ /app/content/
    COPY ./static/ /app/static/
    COPY ./config.toml /app/config.toml
    RUN hugo --source /app --destination /dist --cleanDestinationDir

    FROM nginx:alpine
    COPY ./nginx /etc/nginx/
    COPY --chown=nginx:nginx --from=builder /dist/ /app/
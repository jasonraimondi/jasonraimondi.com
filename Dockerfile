FROM digitalcanvasdesign/hugo-nodejs-builder as builder
WORKDIR /app
COPY .gitmodules /app/.gitmodules
ADD https://github.com/jasonraimondi/hugo-theme-developer-portfolio.git /app/themes/
COPY ./content/ /app/content/
COPY ./static/ /app/static/
COPY ./config.toml /app/config.toml
RUN cd /app && hugo --destination /dist --cleanDestinationDir --minify

FROM nginx:alpine
COPY ./nginx /etc/nginx/
COPY --chown=nginx:nginx --from=builder /dist/ /app/

FROM playwright as resume-builder
WORKDIR /app
COPY snapshotter/package-lock.json snapshotter/package.json /app/snapshotter/
RUN mkdir static \
    && npm --prefix snapshotter ci
COPY snapshotter/src/ /app/snapshotter/src/
RUN npm run gen:resume

FROM klakegg/hugo:0.81.0-ext-alpine as builder
USER root
RUN apk add --update nodejs npm
WORKDIR /app
COPY package-lock.json package.json /app/
RUN npm ci
COPY config.toml postcss.config.js /app/
COPY assets/ /app/assets/
COPY content/ /app/content/
COPY layouts/ /app/layouts/
COPY static/ /app/static/
COPY --from=resume-builder --chown=root:root /app/static /app/resume-static
RUN cp -r /app/resume-static/ /app/static/
COPY taxonomy/ /app/taxonomy/

RUN hugo --source /app --destination /dist --cleanDestinationDir

FROM nginx:alpine
COPY ./nginx /etc/nginx/
COPY --chown=nginx:nginx --from=builder /dist/ /app/

.PHONY: serve

default: build

install:
	npm install -g postcss-cli autoprefixer

serve:
	hugo serve -D

build:
	hugo --gc --cleanDestinationDir --minify

push:
	hugo deploy

publish: build push

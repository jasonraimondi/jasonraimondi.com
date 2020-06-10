.PHONY: serve

default: build

install:
	npm install -g postcss-cli autoprefixer
	git submodule update --init --recursive
	cd themes/hugo-theme-developer-portfolio && npm ci

serve:
	hugo serve -D

build:
	hugo --gc --cleanDestinationDir --minify

push:
	hugo deploy

publish: build push

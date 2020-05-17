.PHONY: serve

default: build

build:
	npm install -g postcss-cli autoprefixer
	git submodule update --init --recursive
	cd themes/hugo-theme-developer-portfolio && npm ci
	hugo --gc

serve:
	hugo serve -D --disableFastRender --bind 0.0.0.0

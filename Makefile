.PHONY: serve

default: build

build:
	npm install -g postcss-cli
	git submodule update --init --recursive
	cd themes/hugo-theme-developer-portfolio && npm ci
	hugo --cleanDestinationDir

serve:
	hugo serve -D --disableFastRender --bind 0.0.0.0

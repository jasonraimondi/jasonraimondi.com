.PHONY: serve

default: build

build:
	npm install -g postcss-cli autoprefixer caniuse-lite
	git submodule upgrade --init --recursive
	hugo --cleanDestinationDir

serve:
	hugo serve -D --disableFastRender --bind 0.0.0.0

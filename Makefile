default: build

local-build:
	cd assets && npm run dev
	cd site && bundle exec jekyll build

docker-push:
	cd docker; make push

build: docker-build

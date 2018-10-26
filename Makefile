export VERSION=3.0.1
export REPO=jasonraimondi/jasonraimondi.com
export TAG=${REPO}:${VERSION}

publish: package build push update-server

package:
	cd assets && npm install && npm run prod
	cd jekyll && bundle install && JEKYLL_ENV=production bundle exec jekyll build

build:
	docker build -t ${TAG} -t ${REPO} .

push:
	docker push ${TAG}
	docker push ${REPO}

update-server:
	ssh theweb2tool "cd jasonraimondi.com-tools && make jason"

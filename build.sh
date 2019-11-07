#!/usr/bin/env bash

set -euo pipefail
set -x

REPOSITORY="jasonraimondi/jasonraimondi.com"
TAG=${1:-latest}

docker build -t "$REPOSITORY:$TAG" .
# docker push "$REPOSITORY:$TAG"

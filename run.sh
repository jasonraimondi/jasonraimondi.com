#!/usr/bin/env bash

set -euo pipefail
set -x

REPOSITORY="jasonraimondi/jasonraimondi.com"
TAG=${1:-latest}

docker run --rm -ti -p 8008:80 "$REPOSITORY:$TAG"

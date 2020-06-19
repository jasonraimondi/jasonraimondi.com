const client = algoliasearch('SW4K8IC1WL', '59e278db07b2cfa54403c4a864f4c61b');
const index = client.initIndex('dev_JASONRAIMONDI');

function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function algoliaSearch() {
    return {
        isLoading: false,
        isTouched: false,
        query: '',
        search: debounce(
            function() {
                this.isLoading = true;
                this.isTouched = true;
                console.log('true true');
                index.search(this.query).then((res) => {
                    console.log(res);
                    const {hits} = res;
                    this.results = hits;
                }).finally(() => {
                    console.log('not loading');
                    this.isLoading = false;
                });
            },
            500
        ),
        results: [],
    };
}

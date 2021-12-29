function sanitizeLinks() {
    const $anchors = document.getElementsByTagName('a');

    for (let $anchor of Array.from($anchors)){
        if(new URL($anchor.href, window.location.href).host !== window.location.host){
            $anchor.setAttribute('rel', 'noopener');
        }
    }
}

void (function () {
    sanitizeLinks();
})();

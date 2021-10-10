function addHeaderDeepLinks() {
    const $div = document.getElementById('js-single');
    const elements = [
        $div.getElementsByTagName('h2'),
        $div.getElementsByTagName('h3'),
        $div.getElementsByTagName('h4'),
        $div.getElementsByTagName('h5'),
        $div.getElementsByTagName('h6'),
    ];
    for (let i = 0; i < elements.length; i++) {
        for (let k = 0; k < elements[i].length; k++) {
            const header = elements[i][k];
            const anchor = document.createElement('a');
            anchor.className = 'header-link';
            anchor.href = '#' + header.id;
            anchor.innerHTML = '#';
            header.insertBefore(anchor, header.firstChild);
        }
    }
}

function sanitizeLinks() {
    const $div = document.getElementById('js-single');

    if (!$div) return;

    const $links = $div.getElementsByTagName('a');

    for (let i = 0, linksLength = $links.length; i < linksLength; i++) {
        if ($links[i].hostname !== window.location.hostname) {
            $links[i].target = '_blank';
            $links[i].rel = 'noopener';
        }
    }
}

void (function () {
    addHeaderDeepLinks();
    sanitizeLinks();
})();

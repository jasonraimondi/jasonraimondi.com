const addHeaderDeepLinks = function () {
    const postDoc = document.getElementById('post-content');
    const elements = [
        postDoc.getElementsByTagName('h2'),
        postDoc.getElementsByTagName('h3'),
        postDoc.getElementsByTagName('h4'),
        postDoc.getElementsByTagName('h5'),
        postDoc.getElementsByTagName('h6'),
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
};

const updateCreditWithLink = function () {
    const credit = document.getElementById('js-feature-image-credit');
    if (!credit) return;

    const [username, url] = credit.innerText.split(' ');

    const $username = document.createElement('a');
    $username.href = 'https://unsplash.com/' + username;
    $username.innerHTML = username;
    $username.target = '_blank';

    const $url = document.createElement('a');
    $url.href = url;
    $url.innerHTML = url;
    $url.target = '_blank';

    credit.innerHTML = '';
    credit.insertBefore($url, credit.firstChild);
    credit.insertBefore(document.createTextNode(' '), credit.firstChild);
    credit.insertBefore($username, credit.firstChild);
};

const sendExternalLinksToNewTab = function () {
    const postDoc = document.getElementById('post-content');
    const links = postDoc.getElementsByTagName('a');

    for (let i = 0, linksLength = links.length; i < linksLength; i++) {
        if (links[i].hostname != window.location.hostname) {
            links[i].target = '_blank';
            links[i].rel = 'nofollow';
        }
    }
};

addHeaderDeepLinks();
updateCreditWithLink();
sendExternalLinksToNewTab();

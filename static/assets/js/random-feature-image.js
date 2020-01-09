function setRandomPicture() {
    const pictures = [
        'https://d265ybhz09ikd5.cloudfront.net/misc/about/us.png',
        'https://d265ybhz09ikd5.cloudfront.net/misc/about/codecraft-2018.jpg',
        'https://d265ybhz09ikd5.cloudfront.net/misc/about/colorado-2018.jpg',
    ];
    const randomPictureLink = pictures[Math.floor(Math.random()*pictures.length)];
    const picture = document.getElementById("js-feature-image");
    picture.src = randomPictureLink;
    alert(randomPictureLink);
}

console.log("HI YA SLUGGER");

setRandomPicture();
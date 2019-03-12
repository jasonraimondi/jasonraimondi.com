const vm = new Vue({el: '#posts-content',});

Vue.component('video-container', {
    props: ['mp4', 'webm', 'poster', 'orientation'],
    computed: {
        isPortrait: function() {
            return this.orientation === 'portrait';
        }
    },
    template: `
        <div :class="{ 'video-portrait': isPortrait}">
        <video controls :poster="poster">
            <source :src="mp4" type="video/mp4">
            <source :src="webm" type="video/webm">
            Your browser doesn't support HTML5 video tag.
        </video>
    </div>
    `
});

Vue.component('image-pop', {
    props: ['src', 'alt', 'portrait'],
    computed: {
        isPortrait: function() {
            return !!portrait;
        },
    },
    template: `
     <div class="image-pop-container" v-bind:class="{ portrait: isPortrait }">
         <img :src="src" :alt="alt" :title="alt" class="pops">
         <small class="image-pop-title">{{ alt }}</small>
     </div>
    `
});

Vue.component('image-gallery', {
    props: ['images'],
    template: `
        <div class="image-gallery-container">
        <template v-for="image in images">
            <a class="image-gallery-anchor" :href="image.src">
                <img class="image-gallery-image" :src="'' + image.src" :alt="image.alt" :title="image.alt">
                <small class="alt-text">{{ image.alt }}</small>
            </a>
        </template>
    </div>
    `
});


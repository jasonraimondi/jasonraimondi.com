import Vue from 'vue';

import ImageGallery from './components/ImageGallery.vue';

import './css/style.css';

const vm = new Vue({
  el: '.vue-image-gallery',
  components: {
    ImageGallery,
  },
});

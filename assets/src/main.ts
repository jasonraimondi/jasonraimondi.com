import Vue from 'vue';

import './css/style.css';
import ImageGallery from './components/ImageGallery.vue';
import ImagePop from './components/ImagePop.vue';
import VideoContainer from './components/VideoContainer.vue';


const vm = new Vue({
  el: '#post-content',
  components: {
    ImageGallery,
    ImagePop,
    VideoContainer,
  },
});

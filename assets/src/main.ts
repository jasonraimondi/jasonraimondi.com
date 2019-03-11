import Vue from 'vue';

import '../../themes/jasontheme/assets/css/style.css';
import ImageGallery from './components/ImageGallery.vue';
import ImagePop from './components/ImagePop.vue';
import VideoContainer from './components/VideoContainer.vue';

const vm = new Vue({
  el: '#posts-content',
  components: {
    ImageGallery,
    ImagePop,
    VideoContainer,
  },
});

let isSidebarOpen = false;

// Toggle button
document.querySelector('.toggle-button').addEventListener('click', function () {
  if (isSidebarOpen) {
    closeSidebar();
  } else {
    openSidebar();
  }
  isSidebarOpen = !isSidebarOpen;
});

function openSidebar() {
  var element = document.querySelector('html');
  element.classList.add('sidebar-is-open');
}


function closeSidebar() {
  var element = document.querySelector('html');
  element.classList.remove('sidebar-is-open');
}

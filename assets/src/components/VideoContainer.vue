<template>
    <div :class="{ 'video-portrait': isPortrait}">
        <video controls :poster="poster">
            <source :src="mp4" type="video/mp4">
            <source :src="webm" type="video/webm">
            Your browser doesn't support HTML5 video tag.
        </video>
    </div>
</template>

<script>
  import Vue from 'vue';
  import './VideoContainer.pcss';

  export default Vue.extend({
    props: ['mp4', 'webm', 'poster', 'orientation'],
    computed: {
      isPortrait() {
        return this.orientation === 'portrait';
      }
    },
  });
</script>


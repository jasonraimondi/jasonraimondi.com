<template>
    <div>
        <vue-plyr>
            <video :poster="poster" :src="mp4">
                <source :src="mp4" type="video/mp4">
                <source :src="webm" type="video/webm">
            </video>
        </vue-plyr>
    </div>
</template>

<script>
  import Vue from 'vue';
  import VuePlyr from 'vue-plyr';

  export default Vue.extend({
    props: ['mp4', 'webm', 'poster', 'orientation'],
    computed: {
      isPortrait() {
        return this.orientation === 'portrait';
      }
    },
    components: {
      VuePlyr
    }
  });
</script>


<template>
    <div class="image-pop-container" v-bind:class="{ portrait: isPortrait }">
        <img :src="src" :alt="alt" :title="alt" class="pops">
        <small class="image-pop-title">{{ alt }}</small>
    </div>
</template>


<script lang="ts">
  import Vue from 'vue';
  import './ImagePop.pcss';

  export default Vue.extend({
    props: ['src', 'alt', 'portrait'],
    computed: {
      isPortrait() {
        return !!this.portrait;
      },
    },
  });
</script>

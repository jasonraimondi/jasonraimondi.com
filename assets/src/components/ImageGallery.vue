<template>
    <div class="image-gallery-container">
        <template v-for="image in images">
            <a class="image-gallery-anchor" :href="image.src">
                <img class="image-gallery-image" :src="image.src" :alt="image.alt" :title="image.alt">
                <small class="alt-text">{{ image.alt }}</small>
            </a>
        </template>
    </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import "./ImageGallery.pcss";

  export default Vue.extend({
    props: ["images"],
  });
</script>

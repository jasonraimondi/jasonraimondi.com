<template>
    <div>
        <my-video v-bind:class="{ 'video-container': true, portrait: isPortrait }" :sources="video.sources" :options="video.options"></my-video>
    </div>
</template>

<script>
  import Video from './Video';

  export default {
    props: ['mp4', 'webm', 'poster', 'orientation'],
    computed: {
      isPortrait() {
        return this.orientation === 'portrait';
      }
    },
    data() {
      return {
        video: {
          sources: [{
            src: this.mp4.toString(),
            type: 'video/mp4'
          }, {
            src: this.webm.toString(),
            type: 'video/webm'
          }],
          options: {
            autoplay: false,
            volume: 0.6,
            poster: this.poster.toString()
          }
        }
      }
    },
    components: {
      myVideo: Video
    }
  }
</script>

<style lang="stylus">
    @require '../theme/styles/config'

    .video-container video
        background-color white

    .portrait
        width 50%
        margin 0 auto

    @media (max-width: $MQLarge)
        .portrait
            width 60%

    @media (max-width: $MQNarrow)
        .portrait
            width 70%

    @media (max-width: $MQMobile)
        .portrait
            width 75%

    @media (max-width: $MQMobileNarrow)
        .portrait
            width 80%

</style>


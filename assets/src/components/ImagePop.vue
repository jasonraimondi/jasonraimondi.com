<template>
    <div class="image-pop-container">
        <img :src="src" :alt="alt" :title="alt" class="pops">
        <small class="image-pop-title">{{ alt }}</small>
    </div>
</template>

<style lang="stylus">
    @require '../theme/styles/config'

    .image-pop-container
        margin 15px auto 30px

    .image-pop-container img
        margin: 10px 0;
        box-shadow 0 0 20px 0 rgba(0,0,0,0.4)

    .image-pop-title
        font-style italic
        color grey
        font-smooth always

    .pops
        max-width 100%
        width 100%
        transition all 200ms

    @media (min-width: $MQLarge)
        .pops:hover
            max-width 125% !important
            width 125% !important
            margin-left -12.5%

</style>

<script>
  export default {
    props: ['src', 'alt'],
    computed: {
      shouldPop() {
        return this.pops === false;
      },
      containerWidth() {
        return 50;
      }
    }
  }
</script>

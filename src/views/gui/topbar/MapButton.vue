<template>
    <div id="map_button">
        <button @click="open">map</button>
    </div>
</template>

<style>
    #map_button {
        height: 100%;
        flex: 1;
        text-align: left;
    }
</style>

<script>
  export default {
    methods: {
      open() {
        this.$store.commit('MAP_TOGGLE')
      }
    }
  }
</script>
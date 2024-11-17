<template>
  <div id="bottom_bar" class="no_focus_game">
    <map-button></map-button>
  </div>
</template>

<script>
import MapButton from '@/views/gui/topbar/MapButton'

export default {
  components: { MapButton },
  methods: {
    openMenu() {
      this.$store.commit('SET_OPEN_MENU', true)
    }
  }
}
</script>
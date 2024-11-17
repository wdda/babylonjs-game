<template>
  <div>
    <div id="level">
      <canvas id="canvas"></canvas>
      <TopBar/>
      <MenuLevel/>
      <Settings/>

      <div id="loading_overlay" v-if="this.$store.state.level.loading">
        <div id="loading_overlay_text">{{ $t("message.loading") }}...</div>
      </div>

      <MobileJoystick v-if="isMobile"></MobileJoystick>

      <LevelPreview/>
    </div>
  </div>
</template>

<style scoped>
#canvas {
  border: 0;
  outline: none;
}

#level {
  position: relative;
}

#app, #canvas, #level, html, body {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}

#loading_overlay {
  background: -webkit-gradient(linear,left top,left bottom,from(#035161),to(#010024));
  background: -webkit-linear-gradient(top,#035161 0,#010024 100%);
  background: -o-linear-gradient(top,#035161 0,#010024 100%);
  background: linear-gradient(180deg,#035161 0,#010024 100%);
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1000;
  top: 0;
  left: 0;
}

#loading_overlay_text {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  margin-top: -20px;
  text-align: center;
  color: #3dc2ff;
  font-size: 20px;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue'
import Game from '@/models/Game'
import TopBar from '@/views/gui/topbar/TopBar.vue'
import LevelPreview from '@/views/LevelPreview.vue'
import MenuLevel from '@/views/gui/MenuLevel.vue'
import Settings from '@/views/gui/Settings.vue'
import { mapGetters } from 'vuex'
import MobileJoystick from "@/views/gui/MobileJoystick.vue"


export default defineComponent({
  name: 'game-level',
  mounted (): void {
    this.$nextTick(() => {
      const game = new Game()
      game.init()
    })
  },
  computed: {
    ...mapGetters([
      'finish'
    ]),
    isMobile() {
      return this.$store.state.isMobile
    }
  },
  watch: {
    finish(value) {
      if (value) {
        this.$store.commit('SET_PAGE', 'FinishPage')
      }
    }
  },
  components: {
    MobileJoystick,
    TopBar,
    LevelPreview,
    MenuLevel,
    Settings
  }
})
</script>
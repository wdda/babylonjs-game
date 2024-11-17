<template>
    <div id="top_bar" class="no_focus_game">
      <div class="grid">
        <div id="menu_button" class="child">
          <div class="menu_button" @click="openMenu"></div>
        </div>
        <div class="child">
          <button v-if="savepointId !== null" class="back" @click="backToSavepoint"></button>
        </div>
        <div class="child" style="text-align: right">
          <span class="child" id="fps_counter" v-show="this.showFps"></span>
        </div>
      </div>
    </div>
</template>

<style>
#fps_counter {
  background-color: black;
  border: 2px solid red;
  text-align: center;
  font-size: 16px;
  color: white;
}
</style>

<script>
  import { Settings } from '@/models/storage/Settings'
  export default {
    mounted () {
      this.showFps = Settings.getValueByName('show_fps')

      this.$store.subscribe(mutation => {
        if (mutation.type === 'SET_SETTING_FIELD_VALUE') {
          if (mutation.payload.name === 'show_fps') {
            this.showFps = mutation.payload.value
          }
        }
      })
    },
    methods: {
      openMenu() {
        this.$store.commit('SET_OPEN_MENU', true)
      },
      backToSavepoint() {
        this.$store.commit('SET_BACK_TO_SAVEPOINT')
      }
    },
    computed: {
      savepointId() {
        return this.$store.state.level.savepointId
      }
    },
    data: function () {
      return {
        showFps: false
      }
    }
  }
</script>
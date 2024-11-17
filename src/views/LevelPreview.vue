<template>
  <div id="level_preview" v-show="!this.$store.state.level.loading && this.show">
    <div class="container">
      <div class="text">
        {{ $t("message.are_you_ready") }}
      </div>
      <div class="container_button">
        <button @click="play" class="button">{{ $t("message.play") }}</button>
      </div>
    </div>
  </div>
</template>

<style>
  #level_preview {
    z-index: 1000;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: -webkit-gradient(linear,left top,left bottom,from(#035161),to(#010024));
    background: -webkit-linear-gradient(top,#035161 0,#010024 100%);
    background: -o-linear-gradient(top,#035161 0,#010024 100%);
    background: linear-gradient(180deg,#035161 0,#010024 100%);
    color: white;
    text-align: center;
  }

  #level_preview .container {
    padding: 10%;
  }

  #level_preview .container_button {
    margin-top: 10%;
  }
</style>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LevelPreview',
  methods: {
    play () {
      this.$store.commit('SET_PLAY')
      this.show = false
    }
  },
  data () {
    return {
      show: true
    }
  }
})
</script>
<template>
  <div id="main_page" class="main_background">
    <div class="main_background_points">
      <div class="top_bar_container">
        <div class="top_bar">
          <div @click="setCurrenPage('SettingsPage')" class="settings">
            <img src="../assets/images/settings-icon.svg">
          </div>
          <div class="sound">
            <img src="../assets/images/sound-icon.svg">
          </div>
        </div>
      </div>

      <div class="button-container">
        <div class="play">
          <div @click="play" class="button">
            <span class="label">{{ $t("message.play") }}</span>
            <span class="icon">
                <span></span>
            </span>
            <span class="label_font">{{ $t("message.play") }}</span>
          </div>
        </div>
        <div class="play">
          <div @click="setCurrenPage('PlayWithFiendsPage')" class="button">
            <span class="label">{{ $t("message.play_with_friends") }}</span>
            <span class="icon">
                <span></span>
            </span>
            <span class="label_font">{{ $t("message.play_with_friends") }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {defineComponent} from "vue"
  import '../styles/main_page.sass'

  export default defineComponent({
    methods: {
      setCurrenPage(page: string) {
        this.$store.commit('SET_PAGE', page)
      },
      play() {
        this.$store.commit('SET_PASSWORD', null)
        this.$store.commit('SET_PAGE', 'LevelsPage')
      }
    }
  })
</script>
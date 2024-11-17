<template>
  <component :is="currentPage"></component>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import LevelsPage from "@/views/LevelsPage.vue"
  import PlayWithFiendsPage from "@/views/PlayWithFiendsPage.vue"
  import LevelPage from "@/views/LevelPage.vue"
  import MainPage from "@/views/MainPage.vue"
  import FinishPage from "@/views/FinishPage.vue"

  export default defineComponent({
    computed: {
      currentPage() {
        return this.$store.state.currentPage
      }
    },
    components: {
      LevelsPage,
      MainPage,
      LevelPage,
      FinishPage,
      PlayWithFiendsPage
    }
  })
</script>
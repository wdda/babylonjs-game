<template>
  <div id="levels_page" class="main_background">
    <div id="box_levels">
      <div id="levels">
        <div v-for="level in levels" :key="level.id" class="level" @click="setLevel(level.id)">
          <div class="content">
            <div>
              <div>
                {{ level.id }}
              </div>
              <div>
                {{ level.name }}
              </div>
            </div>
          </div>
        </div>

        <div class="back_container">
          <div class="back" @click="back()">назад</div>
        </div>
      </div>


    </div>
  </div>
</template>

<script lang="ts">
  import {defineComponent} from "vue"
  import '../styles/levels_page.sass'

  export default defineComponent({
    mounted() {
      fetch('./resources/graphics/levels.json')
          .then((response) => response.json())
          .then((json) => {
            this.$store.commit('SET_LEVELS', json.levels)
      })
    },
    methods: {
      setLevel(number: number) {
        this.$store.commit('SET_LEVEL', number)
        this.$store.commit('SET_PAGE', 'LevelPage')
      },
      back() {
        this.$store.commit('SET_PAGE', 'MainPage')
      }
    },
    computed: {
      levels() {
        return this.$store.state.levels
      }
    }
  })
</script>
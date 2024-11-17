<template>
  <div id="play_with_friends_page">
    <div>
      <div class="tabs_container">
        <ul class="tabs">
          <li :class="{active: isCreate}">
            <a @click="toggleIsCreate">Create</a>
          </li>
          <li :class="{active: isJoin}">
            <a @click="toggleIsJoin">Connect</a>
          </li>
        </ul>

        <div class="tabs_content">
          <div v-if="isCreate">
            <div>
              <div class="label">send to friends</div>
              {{  this.password }} <button @click="copyPassword">copy</button>
            </div>
          </div>

          <div v-if="isJoin">
            <div>
              <div class="label">type password</div>
              <input type="text" placeholder="password" v-model="passwordFriend" :maxlength="lengthPassword">
            </div>
          </div>
        </div>
      </div>

      <div v-if="!isJoin || (isJoin && passwordFriend && passwordFriend.length === lengthPassword)">
        <div class="button" @click="play">{{ $t("message.play") }}</div>
      </div>

      <div class="back_container">
        <div class="back" @click="back()">back</div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue"
import '../styles/play_with_friends_page.sass'
import { Helpers } from '@/models/Helpers'
import copy from 'copy-text-to-clipboard'

export default defineComponent({
  methods: {
    back() {
      this.$store.commit('SET_PAGE', 'MainPage')
    },
    toggleIsCreate() {
      this.isCreate = true
      this.isJoin = false
    },
    toggleIsJoin() {
      this.isCreate = false
      this.isJoin = true
    },
    copyPassword() {
      copy(this.password)
    },
    play() {
      if (this.isCreate) {
        this.$store.commit('SET_PASSWORD', this.password)
      } else {
        this.$store.commit('SET_PASSWORD', this.passwordFriend)
      }

      this.$store.commit('SET_PAGE', 'LevelsPage')
    },
  },
  data() {
    return {
      lengthPassword: 11,
      isCreate: true,
      isJoin: false,
      password: Helpers.generateRandomToken(10),
      passwordFriend: null
    }
  }
})
</script>
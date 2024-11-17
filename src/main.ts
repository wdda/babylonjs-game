import { createApp } from 'vue'
import App from './App.vue'
import { createI18n } from 'vue-i18n'
import './styles/app.sass'
import store from '@/store/vuex'

const messages = {
    en: {
        message: {
            play: 'play',
            settings: 'settings',
            back: 'back',
            play_with_friends: 'play with friends',
            loading: 'loading',
            are_you_ready: 'are you ready?',
            points: 'points',
            back_to_savepoint: 'back to savepoint'
        }
    },
    ru: {
        message: {
            play: 'играть',
            settings: 'настройки',
            back: 'назад',
            play_with_friends: 'играть с друзьями',
            loading: 'загрузка',
            are_you_ready: 'вы готовы?',
            back_to_savepoint: 'вернуться к точки сохранения'
        }
    }
}

const i18n = createI18n({
    locale: 'en',
    messages
})

createApp(App)
  .use(store)
  .use(i18n)
  .mount('#app')
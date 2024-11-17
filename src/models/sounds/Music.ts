import { Sound } from '@babylonjs/core'
import store from '@/store/vuex'
import SoundMain from '@/models/sounds/SoundMain'
import { Store } from 'vuex'
import storeVuex from '@/store/vuex'

export default class Music extends SoundMain {
  filePath: string
  sound: Sound
  store: Store<any>
  
  constructor () {
    super()
    this.store = store
    this.filePath = this.path + '/level_' + storeVuex.state.levelId + '/music.wav'

    this.sound = new Sound('Music', this.filePath, globalThis.scene, () => {
      this.subscribe(store, this.sound, 'music')
    }, {
      loop: true,
      autoplay: store.getters.getSettingsValueByName('music'),
      volume: 0.3
    })
  }
}


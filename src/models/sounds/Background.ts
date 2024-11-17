import { Sound } from '@babylonjs/core'
import store from '@/store/vuex'
import SoundMain from '@/models/sounds/SoundMain'

export default class Background extends SoundMain {
  filePath: string
  sound: Sound

  constructor () {
    super()
    this.filePath = this.path + '/' + 'cosmos.wav'

    this.sound = new Sound('Cosmos', this.filePath, globalThis.scene, () => {
      this.subscribe(store, this.sound, 'sound')
    }, {
      loop: true,
      autoplay: store.getters.getSettingsValueByName('sound')
    })
  }
}


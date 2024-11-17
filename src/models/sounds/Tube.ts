import { Scene, Sound } from '@babylonjs/core'
import { Store } from 'vuex'
import SoundMain from '@/models/sounds/SoundMain'

export default class Tube extends SoundMain {
  filePath: string
  scene: Scene
  sound: Sound
  store: Store<any>

  constructor (path: string, scene: Scene, store: Store<any>) {
    super()
    this.filePath = path + '/' + 'tube.wav'
    this.scene = scene
    this.store = store

    this.sound = new Sound('Tube', this.filePath, this.scene, () => {
      this.subscribe(this.store, this.sound, 'sound')
    }, {
      loop: true,
      autoplay: this.store.getters.getSettingsValueByName('sound')
    })
  }
}
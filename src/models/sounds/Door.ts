import { Mesh, Scene, Sound } from '@babylonjs/core'
import store from '@/store/vuex'
import SoundMain from '@/models/sounds/SoundMain'

export default class Door extends SoundMain {
  fileOpenPath: string
  fileClosePath: string
  scene: Scene
  soundOpen: Sound
  soundClose: Sound

  constructor () {
    super()
    this.fileOpenPath = this.path + '/' + 'door_open.wav'
    this.fileClosePath = this.path + '/' + 'door_close.wav'
    this.scene = globalThis.scene

    this.soundOpen = new Sound('DoorOpen', this.fileOpenPath, this.scene, null, {
      loop: false,
      autoplay: false,
      spatialSound: true,
      maxDistance: 15
    })

    this.soundClose = new Sound('DoorClose', this.fileClosePath, this.scene, null, {
      loop: false,
      autoplay: false,
      spatialSound: true,
      maxDistance: 15
    })
  }

  playOpen(mesh: Mesh) {
    if (store.getters.getSettingsValueByName('sound')) {
      this.soundOpen.attachToMesh(mesh)
      this.soundOpen.play()
    }
  }

  playClose(mesh: Mesh) {
    if (store.getters.getSettingsValueByName('sound')) {
      this.soundClose.attachToMesh(mesh)
      this.soundClose.play()
    }
  }
}

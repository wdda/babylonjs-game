import { Mesh } from '@babylonjs/core'
import store from "@/store/vuex"

export default class Finish {
  static setDetector (playerId: string) {
    const meshFoot = scene.getMeshById('playerFoot_' + playerId) as Mesh
    const finishMesh = scene.getMeshById('finish')

    if (finishMesh) {
      setInterval(() => {
        if (!store.getters.finish && meshFoot.intersectsMesh(finishMesh, false)) {
          store.commit('SET_FINISH')
        }
      }, 100)
    } else {
     console.error('Mesh for finish not found')
    }
  }
}
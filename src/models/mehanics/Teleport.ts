import { Mesh, Vector3 } from '@babylonjs/core'

export default class Teleport {
  meshFoot: Mesh
  playerId: string
  
  constructor (playerId: string) {
    this.playerId = playerId
    this.meshFoot = globalThis.scene.getMeshById('playerFoot_' + playerId) as Mesh
  }
  
  run (position: Vector3) {
    this.meshFoot.setAbsolutePosition(position)
  }
}
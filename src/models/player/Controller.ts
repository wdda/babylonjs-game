import { AbstractMesh, Mesh, Scene } from '@babylonjs/core'
import store from '@/store/store'
import {Player, Settings, SyncData} from '@/store/types'

export default class Controller {
  playerId: string
  scene: Scene
  meshHead: Mesh
  meshFoot: Mesh
  meshCharacter: AbstractMesh
  player: Player
  settings: Settings
  
  constructor (playerId: string) {
    this.playerId = playerId
    this.player = store.getPlayer(this.playerId)
    this.settings = store.getSettings()
    this.scene = globalThis.scene
    this.meshFoot = this.scene.getMeshById('playerFoot_' + playerId) as Mesh
    this.meshHead = this.scene.getMeshById('playerHead_' + playerId) as Mesh
    this.meshCharacter = this.scene.getMeshById('characterBody_' + playerId) as AbstractMesh
  }
  
  subscribe () {
    store.subscribe(this.playerId, (type: string, data: any) => {
      if (type === 'syncData') {
        if (!this.player.move.isFlying) {
            this.syncPosition(data)
        }
      
        this.syncRotation(data)
        this.syncCharacter(data)
      }
    })
  }

  //TODO: add lerp
  private syncPosition (data: SyncData) {
    const meshFoot = this.meshFoot
    
    const endX = data.position.x
    const endY = data.position.y
    const endZ = data.position.z
    
    const startX = meshFoot.position.x
    const startY = meshFoot.position.y
    const startZ = meshFoot.position.z
    
    if (endX !== startX) {
      meshFoot.position.x = endX
    }
    
    if (endY !== startY) {
      meshFoot.position.y = endY
    }
    
    if (endZ !== startZ) {
      meshFoot.position.z = endZ
    }
  }
  
  private syncRotation (data: SyncData) {
    const meshFoot = this.meshFoot
    const startY = meshFoot.rotation.y
    const endY = data.rotation.y
    
    if (startY !== endY) {
      meshFoot.rotation.y = endY
    }
    
    const meshHead = this.meshHead
    const startX = meshHead.rotation.x
    const endX = data.rotation.x
    
    if (startX !== endX) {
      meshHead.rotation.x = endX
    }
  }
  
  private syncCharacter (data: SyncData) {
    this.meshCharacter.rotation.y = data.characterAngle
  }
}

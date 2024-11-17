import * as Colyseus from 'colyseus.js'
import storeVuex from '@/store/vuex'
import store from '@/store/store'
import { Mesh } from '@babylonjs/core'

export default class ServerClient {
  sessionId: string | null
  playerId: string
  room?: Colyseus.Room | null
  
  constructor (playerId: string) {
    this.sessionId = null
    this.room = null
    this.playerId = playerId
  }
  
  init () {
    const client = new Colyseus.Client(process.env.VUE_APP_SERVER_DOMAIN)
    const levelId = storeVuex.state.levelId
    const password = storeVuex.state.password

    client.joinOrCreate('main_room', { levelId, password }).then(room => {
      this.room = room
      this.syncData()

      this.room.state.players.onAdd((player: any) => {
        if (player.id !== this.playerId) {
          console.log(player)
          store.addPlayer(player.id, player.skinColor)
        }
      })

      const selfPlayer= store.getSelfPlayer()
      this.room.send('createPlayer', { playerId: this.playerId, skinColor: selfPlayer.skinColor })
      
      store.subscribe(this.playerId, (type: string, data: any) => {
        if (type === 'forward') {
          this.room?.send('syncForward', { playerId: this.playerId, forward: data })
        }

        if (type === 'jump') {
          this.room?.send('syncJump', { playerId: this.playerId, data })
        }
        
        if (type === 'syncData') {
          this.room?.send('syncData', { playerId: this.playerId, data })
        }
      })
      
      this.room.onMessage('syncForward', (message) => {
        store.setForward(message.playerId, message.forward)
      })

      this.room.onMessage('syncJump', (message) => {
        store.setJump(message.playerId, message.data)
      })
      
      this.room.onMessage('syncData', (message) => {
        store.setSyncData(message.playerId, message.data)
      })
    })
  }
  
  private syncData() {
    setInterval(() => {
      const meshHeadId = 'playerHead_' + this.playerId
      const meshFootId = 'playerFoot_' + this.playerId
      
      const head = globalThis.scene.getMeshById(meshHeadId) as Mesh
      const foot = globalThis.scene.getMeshById(meshFootId) as Mesh
      const character = globalThis.scene.getMeshById('characterBody_' + this.playerId) as Mesh
      
      store.setSyncData(this.playerId, {
        position: { x: foot.position.x, y: foot.position.y, z: foot.position.z },
        rotation: { x: foot.rotation.x, y: head.rotation.y },
        characterAngle: character.rotation.y
      })
    }, 100)
  }
}
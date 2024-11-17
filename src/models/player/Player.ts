import Body from '../сommon/Body'
import Controller from './Controller'
import Character from '@/models/сommon/character/Character'
import Move from '@/models/player/Move'

export default class Player {
  body: Body
  character: Character
  controller?: Controller
  playerId: string
  
  constructor (playerId: string) {
    this.playerId = playerId
    this.body = new Body(playerId)
    this.character = new Character(playerId)
  
    this.character.load(() => {
      this.controller = new Controller(playerId)
      this.controller.subscribe()
      
      new Move(this.playerId)
    })
  }
  
  /*dispose() {
    this.controller?.dispose()
    this.character.dispose()
    this.body.dispose()
  }*/
}

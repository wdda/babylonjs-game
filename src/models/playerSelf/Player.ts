import Body from '../сommon/Body'
import Character from '@/models/сommon/character/Character'
import Camera from '@/models/playerSelf/Camera'
import store from '@/store/store'
import storeVuex from '@/store/vuex'
import Controller from '@/models/playerSelf/Controller'
import Move from './Move'

class Player {
  init(callbackLoad: any) {
    new Body(store.getSelfPlayerId())
    
    const character = new Character(store.getSelfPlayerId())
    
    character.load(() => {
      new Camera()

      if (!storeVuex.state.isMobile) {
        new Controller()
      }

      new Move()
      callbackLoad()
    })
  }
}

export default new Player()

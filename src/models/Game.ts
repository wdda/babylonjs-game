import {Color3, Engine} from '@babylonjs/core'
import Scene from './scene/Scene'
import store from '@/store/store'
import storeVuex from '@/store/vuex'
import Audio from '@/models/sounds/Audio'
import ServerClient from './ServerClient'
import PlayerSelf from '@/models/playerSelf/Player'
import Player from '@/models/player/Player'
import { v4 as uuidv4 } from 'uuid'
import RegisterTagsExtension from '@/models/scene/TagsExtansion'
import Collisions from '@/models/mehanics/Collisions'
import Canvas from "@/models/scene/Canvas";
import Points from '@/models/mehanics/Points'
import Finish from "@/models/mehanics/Finish"
import DevMode from "@/models/scene/DevMode"
import Savepoint from "@/models/mehanics/Savepoint"
import BlendModes from '@/models/scene/BlendModes'
import Materials from "@/models/scene/Materials"
import OutLiner from "@/models/scene/OutLiner"
import Doors from '@/models/mehanics/Doors'
import Prefabs from '@/models/scene/Prefabs'
import Optimize from '@/models/scene/Optimize'

export default class Game {
  
  init () {
    const playerId = this.getPlayerId()
    const skinColor = Color3.Random()
    store.setPlayerId(playerId)
    store.addPlayer(playerId, skinColor)
    
    globalThis.assetContainers = []
    const canvas = Canvas.setCanvas()
    const engine = new Engine(canvas, true, { preserveDrawingBuffer: false, stencil: true })
    const sceneModel = new Scene(engine)
    
    sceneModel.load(async () => {
      new Audio()
      sceneModel.setEnvironment()

      this.setClassesGame(() => {
        PlayerSelf.init(() => {
          const serverClient = new ServerClient(playerId)
          serverClient.init()

          store.subscribeAddPlayer((playerId: string) => {
            new Player(playerId)
          })

          Finish.setDetector(playerId)
          new Points(playerId)

          storeVuex.commit('LOADING_TOGGLE')
        })
      })
    })
  }
  
 setClassesGame (callback: any) {
    RegisterTagsExtension()

    new DevMode()
    globalThis.collisions = new Collisions()
    callback()
    Savepoint.init()
    Materials.addCustomMaterial()
    BlendModes.init()
    OutLiner.init()
    new Doors()

   new Prefabs(() => {
      //Optimize.setMeshes(globalThis.scene.meshes)
    })
  }
  
  getPlayerId () {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    let playerId = urlParams.get('playerId')
    
    if (!playerId) {
      playerId = 'guest_' + uuidv4()
    }
    
    return playerId
  }
}
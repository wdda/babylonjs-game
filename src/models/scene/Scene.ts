import {
  Engine,
  RollingAverage,
  Scene as BabylonScene,
  SceneLoader,
  SceneOptimizer,
  SceneOptimizerOptions
} from '@babylonjs/core'

import storeVuex from '@/store/vuex'
import Environment from '@/models/scene/Environment'

export default class Scene {
  scene: BabylonScene
  engine: Engine
  store: any

  constructor (engine: Engine) {
    this.scene = new BabylonScene(engine)
    globalThis.scene = this.scene
    this.engine = engine

    const rollingAverage = new RollingAverage(60)

    globalThis.scene.onBeforeRenderObservable.add(() => {
      rollingAverage.add(globalThis.scene.getAnimationRatio())
      globalThis.average = rollingAverage.average
    })
  }

  async load (callbackLoad: () => void) {
    window.addEventListener('resize', () => {
      this.engine.resize()
    })

    SceneLoader.CleanBoneMatrixWeights = true
    SceneLoader.ShowLoadingScreen = false

    const fileName = 'map.babylon'
    const filePath = process.env.VUE_APP_RESOURCES_PATH + 'graphics/level_' + storeVuex.state.levelId + '/'

    const timestamp = 1
    const filePathWithTimestamp = fileName + '?timestamp=' + timestamp

    SceneLoader.Append(filePath, filePathWithTimestamp, this.scene, () => {
      try {
        callbackLoad()
        const divFps = document.getElementById('fps_counter') as HTMLElement
        this.optimize()

        this.engine.runRenderLoop(() => {
          this.scene.render()
          divFps.innerHTML = this.engine.getFps().toFixed() + ' fps'
        })
      } catch (e) {
        console.error(e)
      }
    }, null, (scene, message, error) => {
      console.error(error, message)
    })
  }

  private optimize () {
    const scene = globalThis.scene
    scene.autoClearDepthAndStencil = false
    scene.disablePhysicsEngine()
    scene.skipPointerMovePicking = true

    const options = new SceneOptimizerOptions(60)
    const optimizer = new SceneOptimizer(scene, options)
    optimizer.start()
  }

  setEnvironment () {
    fetch('./resources/graphics/environment.json')
      .then((response) => response.json())
      .then((json) => {
        storeVuex.commit('SET_ENVIRONMENT', json)

        const environment = new Environment()
        environment.setupHDR()
        environment.setupGlow()
       // environment.setupSSAO()
        environment.setupFog()
        environment.setupLightAndShadow()
        environment.setupLightPoints()
       // environment.setupSky()
        //environment.setupSkybox()
      })
  }
}

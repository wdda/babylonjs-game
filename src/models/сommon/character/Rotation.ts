import { AbstractMesh, Animation, Scene, Tools, Animatable } from '@babylonjs/core'
import store from '@/store/store'
import { Helpers } from "@/models/Helpers"

export default class Rotation {
  animation: Animation | undefined
  scene: Scene
  playerId: string
  angle: number
  meshCharacter: AbstractMesh
  meshFoot: AbstractMesh
  animatable: Animatable | undefined
  forwardAngle: number
  isAnimating: boolean
  syncIntervalId: any
  lastManualRotationTime: number
  
  constructor (playerId: string) {
    this.scene = globalThis.scene
    this.playerId = playerId
    this.angle = 0
    this.meshCharacter = this.scene.getMeshById('characterBody_' + this.playerId) as AbstractMesh
    this.meshFoot = this.scene.getMeshById('playerFoot_' + this.playerId) as AbstractMesh
    this.animation = undefined
    this.animatable = undefined
    this.isAnimating = false
    this.forwardAngle = 0
    this.lastManualRotationTime = Date.now()

    this.setAnimation()
    this.subscribe()
  }

  private setAnimation () {
    this.animation = new Animation(
      'rotateMesh',
      'rotation.y',
      20,
      Animation.ANIMATIONTYPE_FLOAT
    )
  }


  private subscribe () {
    store.subscribe(this.playerId, (type: string) => {
      if (type === 'forward') {
        this.setAngle()
      }
    })

    this.syncIntervalId = setInterval(() => {
      this.setAngle()
    }, 50)

  }

  private setAngle (animated = true) {
    if (this.isAnimating) {
      return
    }

    const state = store.getPlayer(this.playerId)

    if (!state) {
      return
    }
    
    const stateForward = state.move.forward

    if (!stateForward.isMoving) {
      return
    }

    let angleNew = 0

    if (stateForward.left) {
      angleNew = 270
    }

    if (stateForward.right) {
      angleNew = 90
    }

    if (stateForward.front) {
      angleNew = 0

      if (stateForward.left) {
        angleNew = 305
      }

      if (stateForward.right) {
        angleNew = 45
      }
    }

    if (stateForward.back) {
      angleNew = 180

      if (stateForward.left) {
        angleNew = 225
      }

      if (stateForward.right) {
        angleNew = 135
      }
    }
  
    let radianNew = Tools.ToRadians(angleNew) + this.meshFoot.rotation.y
    const radianOld = this.meshCharacter.rotation.y
  
    const angleOld = Tools.ToDegrees(radianOld)
    angleNew = Tools.ToDegrees(radianNew)
  
    const diff = (angleNew - angleOld + 180) % 360 - 180
    const shortWayAngle = diff < -180 ? diff + 360 : diff
    radianNew = radianOld + Tools.ToRadians(shortWayAngle)

    // const diffAngle = Math.abs(radianNew - radianOld) / (Math.PI / 180)
    const diffRadians = this.differenceInRadians(radianNew, radianOld)

    if (diffRadians) {
      if (animated) {
        this.play(radianNew, radianOld)
      }
    }
  }

  private play (radianNew: number, radianOld: number) {
    if (this.animation === undefined) {
      console.error('Not set animation rotate')
      return
    }

    if (radianNew === radianOld) {
      return
    }

    this.isAnimating = true
    const countFrames = 6
    const keys = []

    keys.push({
      frame: 0,
      value: radianOld
    })

    keys.push({
      frame: countFrames,
      value: radianNew
    })

    this.animation.setKeys(keys)
    this.meshCharacter.animations = []
    this.meshCharacter.animations.push(this.animation)

    this.animatable = this.scene.beginAnimation(this.meshCharacter, 0, countFrames, false, 2, () => {
      this.isAnimating = false
    })
  }

  private differenceInRadians(a: number, b: number) {
    let diff = a - b
    while (diff < -Math.PI) diff += 2 * Math.PI
    while (diff > Math.PI) diff -= 2 * Math.PI
    return Helpers.numberFixed(Math.abs(diff), 4)
  }
  
  private stopAnimation()
  {
    if (this.animatable !== undefined) {
      this.animatable.stop()
    }
  }
  
  dispose () {
    if (this.syncIntervalId) {
      clearInterval(this.syncIntervalId)
    }
  }
}

import {
  Mesh,
  Vector3,
  Scene,
  AbstractMesh,
  Nullable, Observer, PickingInfo, Scalar
} from '@babylonjs/core'
import Collisions from '../mehanics/Collisions'
import store from '../../store/store'
import { Forward, Settings } from '@/store/types'
import { Helpers } from '@/models/Helpers'
import RayCastFootOne from "@/models/сommon/rayCast/RayCastFootOne"
import RayCastFootTwo from "@/models/сommon/rayCast/RayCastFootTwo"
import RayCastFootThree from "@/models/сommon/rayCast/RayCastFootThree"
import RayCastFootFour from "@/models/сommon/rayCast/RayCastFootFour"
import { Player } from '@/store/types'
import Jump from "@/models/сommon/Jump";
import Rotation from "@/models/сommon/Rotation";
import RayCastFoot from "@/models/сommon/rayCast/RayCastFoot";

export default class Move {
  meshFoot: Mesh
  scene: Scene
  footIsCollision: AbstractMesh | boolean
  modelCollisions: Collisions
  oldForward: Forward
  isFlying: boolean
  isFlyingTimeOutId: number
  playerId: string
  observerBefore?: Nullable<Observer<Scene>>
  pointGrounded: PickingInfo | null
  nextStep: Vector3
  settings: Settings
  speed: number
  speedType: string
  speedGravity: number
  rayCastFoot: Array<RayCastFoot>
  player: Player
  lastPositionMobilePlatform: null | Vector3

  constructor (playerId: string) {
    this.scene = globalThis.scene
    this.meshFoot = this.scene.getMeshById('playerFoot_' + playerId) as Mesh
    this.modelCollisions = globalThis.collisions
    
    this.isFlying = true
    this.playerId = playerId
    
    this.settings = store.getSettings()
    this.speed = 0
    this.speedType = 'Idle'
    this.speedGravity = this.settings.gravityMin
    this.player = store.getPlayer(playerId)
    
    this.footIsCollision = false
    this.pointGrounded = null
    this.nextStep = Vector3.Zero()
    this.isFlyingTimeOutId = 0
    this.lastPositionMobilePlatform = null
    
    this.oldForward = {
      left: false,
      right: false,
      front: false,
      back: false,
      isMoving: false,
      sprint: false
    }

    this.rayCastFoot = []
    this.rayCastFoot.push(new RayCastFootOne(this.meshFoot))
    this.rayCastFoot.push(new RayCastFootTwo(this.meshFoot))
    this.rayCastFoot.push(new RayCastFootThree(this.meshFoot))
    this.rayCastFoot.push(new RayCastFootFour(this.meshFoot))

    new Jump(this.playerId)
    new Rotation(this.playerId)

    this.observerBefore = this.scene.onBeforeAnimationsObservable.add(() => {
      this.beforeRender()
    })
  }
  
  private move () {
    const forward = this.player.move.forward
    this.changeSpeed()

    if (!forward.isMoving) {
      return null
    }

    if (this.speed) {
      const speed = this.speed * average

      if (forward.front) {
        this.nextStep.z = speed
      }

      if (forward.back) {
        this.nextStep.z = -speed
      }

      if (forward.left) {
        this.nextStep.x = -speed
      }

      if (forward.right) {
        this.nextStep.x = speed
      }
    }

  }
  
  private gravity () {
    if (this.player.move.jumpRunning) {
      return
    }

    if (this.pointGrounded) {
      this.speedGravity = this.settings.gravityMin
      const ray = this.pointGrounded.ray

      if (ray) {
        const nextY = Helpers.numberFixed(ray.length - this.pointGrounded.distance - 0.03, 5)

        if (Helpers.numberFixed(nextY, 5) !== Helpers.numberFixed(this.nextStep.y, 5)) {
          this.nextStep.y = nextY
        }
      }
    }

    if (!this.pointGrounded) {
      const gravityMax = this.settings.gravityMax
      const gravityMin = this.settings.gravityMin
      const acceleration = this.settings.accelerationGravity * average

      this.speedGravity = Scalar.Clamp(this.speedGravity + acceleration, gravityMin, gravityMax)

      this.nextStep.y = Helpers.numberFixed(-(this.speedGravity * average), 5)
    }
  }

  private setIsFlying() {
    const oldIsFlying = this.isFlying
    this.pointGrounded = null


    this.rayCastFoot.some((rayCast) => {
      const point = rayCast.cast((mesh: AbstractMesh) => {
        return mesh.checkCollisions && mesh.isEnabled()
      })

      if (point !== null) {
        this.pointGrounded = point

        return true
      }
    })

    const newIsFlying = this.pointGrounded === null

    if (oldIsFlying !== newIsFlying) {
      this.isFlying = newIsFlying
      store.setIsFlying(this.playerId, newIsFlying)
    }
  }

  private setNewPosition (nextStep: Vector3) {
    if (nextStep.x || nextStep.y || nextStep.z) {
      const matrix = this.meshFoot.getWorldMatrix()
      const vector = Vector3.TransformNormal(nextStep, matrix)
      this.meshFoot.moveWithCollisions(vector)
    }
  }

  private changeSpeed () {
    const forward = this.player.move.forward

    if (!forward.left && !forward.right && (this.oldForward.front != forward.front)) {
      this.speed = 0
    }
    
    if (!forward.left && !forward.right && (this.oldForward.back != forward.back)) {
      this.speed = 0
    }
    
    if (!forward.front && !forward.back && (this.oldForward.left != forward.left)) {
      this.speed = 0
    }
    
    if (!forward.front && !forward.back && (this.oldForward.right != forward.right)) {
      this.speed = 0
    }

    let speed = 0
    const speedRun = this.settings.speed
    const speedSprint = this.settings.speedSprint
    let speedType = 'Idle'

    if (this.player.move.forward.isMoving) {
      speed = forward.sprint ? speedSprint : speedRun
    }

    const acceleration = this.settings.acceleration * average

    if (this.speed < speed) {
      this.speed = Scalar.Clamp(this.speed + acceleration, 0, speed)
    }

    if (this.speed > speed) {
      this.speed = Scalar.Clamp(this.speed - acceleration, 0, speed)
    }

    if (this.speed) {
      speedType = 'Run'

      if (this.speed >= speedSprint) {
        speedType = 'Sprint'
      }
    }

    if (this.speedType != speedType) {
      this.speedType = speedType
      store.setSpeedType(this.playerId, speedType)
    }

    if (this.player.move.speed != this.speed) {
      store.setSpeed(this.playerId, this.speed)
    }

    this.oldForward = { ...forward }
  }
  
  private mobilePlatform()
  {
    if (this.pointGrounded && Helpers.hasTag(this.pointGrounded.pickedMesh as Mesh, 'mobile')) {
      const mobilePlatform = this.pointGrounded.pickedMesh
      
      if (mobilePlatform) {
        if (this.lastPositionMobilePlatform) {
          const deltaPosition = mobilePlatform.position.subtract(this.lastPositionMobilePlatform)
          
          this.meshFoot.position.addInPlace(deltaPosition)
        }

        this.lastPositionMobilePlatform = mobilePlatform.position.clone()
      }
      
    } else {
      this.lastPositionMobilePlatform = null
    }
  }
  
  private beforeRender () {
    this.nextStep = Vector3.Zero()
    this.setIsFlying()
    this.mobilePlatform()
    this.gravity()
    this.move()
    this.setNewPosition(this.nextStep)
  }
  
  dispose () {
    if (this.observerBefore) {
      this.scene.onBeforeRenderObservable.remove(this.observerBefore)
    }
  }
}

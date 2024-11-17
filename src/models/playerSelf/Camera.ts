import {
  Vector3,
  UniversalCamera,
  Scene,
  UniversalCamera as BabylonCamera,
  Ray,
  AbstractMesh, Axis, Scalar
} from '@babylonjs/core'
import store from '@/store/store'
import { Player } from '@/store/types'
import { Helpers } from '@/models/Helpers'

interface CalculateDistance {
  distance: number;
  amount: number;
}

//TODO: move to settings
const MAX_DIST_CAMERA_Z = 3.4
const MAX_DIST_CAMERA_Y = 0.4

export default class Camera {
  scene: Scene
  babylonCamera: BabylonCamera
  meshHead: AbstractMesh
  actualDistance: number
  calculateDistance: CalculateDistance
  player: Player
  
  constructor () {
    this.scene = globalThis.scene
    this.babylonCamera = new UniversalCamera('playerCamera', Vector3.Zero(), this.scene)
    this.meshHead = this.scene.getMeshById('playerHead_' + store.getSelfPlayerId()) as AbstractMesh
    this.actualDistance = -MAX_DIST_CAMERA_Z
    this.player = store.getSelfPlayer()
    
    this.calculateDistance = {
      amount: 0,
      distance: 0
    }
    
    this.init()
  }
  
  private init () {
    this.babylonCamera.maxZ = 500
    this.babylonCamera.minZ = 0.02
    this.babylonCamera.name = 'player'
    this.babylonCamera.fov = 1
    this.scene.activeCamera = this.babylonCamera

    this.attachCamera()
  }
  
  private attachCamera () {
    this.scene.registerBeforeRender(() => {
      this.setDistance()
      this.babylonCamera.position = this.meshHead.position

      const targetRotationX = this.meshHead.rotation.x;
      const targetRotationY = this.meshHead.rotation.y;

      this.babylonCamera.rotation.x = Scalar.Lerp(this.babylonCamera.rotation.x, targetRotationX, 0.2);
      this.babylonCamera.rotation.y = Scalar.Lerp(this.babylonCamera.rotation.y, targetRotationY, 0.2);

      this.actualDistance = Number(Scalar.Lerp(this.actualDistance, this.calculateDistance.distance, this.calculateDistance.amount).toFixed(5))
      
      const dirZ = this.babylonCamera.getDirection(Axis.Z)
      this.babylonCamera.position.addInPlace(dirZ.scaleInPlace(this.actualDistance))
      
      const dirY = this.babylonCamera.getDirection(Axis.Y)
      this.babylonCamera.position.addInPlace(dirY.scaleInPlace(-MAX_DIST_CAMERA_Y))
    })
  }
  
  private setDistance () {
    const headPosition = this.meshHead.position
    let forward = new Vector3(0, -MAX_DIST_CAMERA_Y, -MAX_DIST_CAMERA_Z)
    const m = this.meshHead.getWorldMatrix()
    forward = Vector3.TransformCoordinates(forward, m)
    const direction = Vector3.Normalize(forward.subtract(headPosition))
    let distance = -MAX_DIST_CAMERA_Z
    let amount = 0.02

    if (this.player.move.forward.isMoving) {
      distance = -MAX_DIST_CAMERA_Z - 1.2
    }

    const ray = new Ray(headPosition, direction, Math.abs(distance))

    const pickResult = this.scene.pickWithRay(ray, (mesh) => {
      return mesh.checkCollisions
    })

    if (pickResult && pickResult.pickedMesh) {
      distance = -Helpers.numberFixed(pickResult.distance - 1, 5)
      amount = 0.5
    }
  
    this.calculateDistance.distance = distance
    this.calculateDistance.amount = amount
  }
}

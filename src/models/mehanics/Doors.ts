import { Mesh, Scene, AnimationGroup } from '@babylonjs/core'
import { Helpers } from '@/models/Helpers'
import DoorSound from '@/models/sounds/Door'

export default class Doors {
  scene: Scene
  meshesDetectors: Array<Mesh>
  doorOpen: boolean
  collect: Array<any>
  sound: DoorSound

  constructor () {
    this.scene = globalThis.scene
    this.meshesDetectors = Helpers.getMeshesByName('Door_detected', true)
    this.doorOpen = false
    this.sound = new DoorSound()
    this.collect = []

    this.init()
  }

  private init() {
    this.setCollection()
    this.run()
  }

  private setCollection() {
    this.meshesDetectors.forEach(meshDetector => {
      const nameId = Helpers.getNameId(meshDetector.id)
      const meshLeft = this.scene.getMeshById('Door_left.' + nameId)
      const meshRight = this.scene.getMeshById('Door_right.' + nameId)
      const meshCastle = this.scene.getMeshById('Door_castle.' + nameId)
      const meshCastle2 = this.scene.getMeshById('Door_castle_2.' + nameId)
      meshDetector.isVisible = false

      if (meshLeft && meshRight && meshCastle && meshCastle2) {
        const animationGroup = new AnimationGroup('door_' + nameId)

        meshLeft.animations.forEach(animation => {
          animationGroup.addTargetedAnimation(animation, meshLeft)
        })

        meshCastle.animations.forEach(animation => {
          animationGroup.addTargetedAnimation(animation, meshCastle)
        })

        meshCastle2.animations.forEach(animation => {
          animationGroup.addTargetedAnimation(animation, meshCastle2)
        })

        meshRight.animations.forEach(animation => {
          animationGroup.addTargetedAnimation(animation, meshRight)
        })

        animationGroup.normalize(0, 35)

        this.collect.push({
          open: false,
          meshLeft,
          meshRight,
          meshDetector,
          animationGroup
        })
      }
    })
  }

  private run () {
    setInterval(() => {
      this.collect.forEach(door => {
        const foots = this.scene.getMeshesByTags("foot")
        let foodCollision = false
        
        foots.forEach((meshFoot) => {
          if (door.meshDetector.intersectsMesh(meshFoot, true)) {
            foodCollision = true
          }
        })
  
        if (!door.open && !door.animationGroup.isPlaying && foodCollision) {
          door.open = true
          door.animationGroup.start(false, 1, 0, 15)
          this.sound.playOpen(door.meshRight)
        }
  
        if (door.open && !door.animationGroup.isPlaying && !foodCollision) {
          door.open = false
          door.animationGroup.start(false, 1, 20, 35)
          this.sound.playClose(door.meshLeft)
        }
      })
    }, 100)
  }
}
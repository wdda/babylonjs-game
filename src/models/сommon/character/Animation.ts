import {Scalar, Scene} from '@babylonjs/core'
import { AnimationGroupInterface } from './animation_groups/AnimationGroupInterface'
import Idle from './animation_groups/Idle'
import Run from './animation_groups/Run'
import JumpMiddle from './animation_groups/JumpMiddle'
import JumpFinish from './animation_groups/JumpFinish'
import store from '@/store/store'
import Sprint from '@/models/сommon/character/animation_groups/Sprint'
import {Player} from "@/store/types"
import {Helpers} from "@/models/Helpers"
import Walk from "@/models/сommon/character/animation_groups/Walk"

export default class Animation {
  playerId: string
  animationGroupCurrent: AnimationGroupInterface
  animationNameCurrent: string
  animationGroups: Array<AnimationGroupInterface>
  scene: Scene
  blockedOtherAnimation: boolean
  statePlayer: Player
  storeTypesEvent: Array<string>
  observableBeforeAnimation: any
  timeOutId: number | null
  timeOutIdJumpMiddle: number | null
  lastTimeFly: number

  constructor (playerId: string) {
    this.playerId = playerId
    this.scene = globalThis.scene
    this.animationGroups = []
    this.blockedOtherAnimation = false
    this.statePlayer = store.getPlayer(playerId)
    this.timeOutId = null
    this.timeOutIdJumpMiddle = null
    this.lastTimeFly = 0

    this.storeTypesEvent = [
        'forward',
        'isFlying',
        'isFlyingEnd',
        'jumpStart',
        'speedType'
    ]

    this.setAnimationGroups()

    this.animationGroupCurrent = this.animationGroups[0]
    this.animationNameCurrent = 'none'

    this.subscribeStore()

    this.setAnimation('JumpMiddle')

    this.observableBeforeAnimation = () => {
      this.blending()
    }
  }

  private setAnimationGroups () {
    this.animationGroups.push(new Idle(this.playerId))
    this.animationGroups.push(new Run(this.playerId))
    this.animationGroups.push(new Sprint(this.playerId))
    this.animationGroups.push(new JumpMiddle(this.playerId))
    this.animationGroups.push(new JumpFinish(this.playerId))
    this.animationGroups.push(new Walk(this.playerId))
  }


  private subscribeStore()
  {
    store.subscribe(this.playerId, (type: string) => {
      if (!this.storeTypesEvent.includes(type) || this.blockedOtherAnimation) {
        return
      }

      let name = 'JumpMiddle'

      if (!this.statePlayer.move.isFlying) {
        name = this.statePlayer.move.speedType
      }

      if (type === 'isFlying') {
        if (!this.statePlayer.move.isFlying && (Helpers.getTime() - this.lastTimeFly) > 300) {
          this.blockedOtherAnimation = true
          name = 'JumpFinish'

          setTimeout(() => {
            this.blockedOtherAnimation = false
            this.setAnimation(this.statePlayer.move.speedType)
          }, 300)
        } else {
          this.lastTimeFly = Helpers.getTime()
        }
      }

      this.setAnimation(name)
    })
  }

  setAnimation(name: string) {
    if (name !== 'none' && name !== this.animationNameCurrent) {
      this.animationNameCurrent = name

      scene.onBeforeAnimationsObservable.removeCallback(this.observableBeforeAnimation)

      this.animationGroupCurrent = this.animationGroups.find(group => group.name === name) as AnimationGroupInterface

      if (!this.animationGroupCurrent.autoPlayLoop) {
        this.animationGroupCurrent.animation?.play()
      }

      scene.onBeforeAnimationsObservable.add(this.observableBeforeAnimation)
    }
  }

  blending() {
    this.disableAnimations()
    const transitionSpeed = Helpers.numberFixed(store.getSettings().transitionAnimationSpeed * average, 2)

    const newWeight = Scalar.Clamp(this.animationGroupCurrent.weight + transitionSpeed, 0, 1)

    if (this.animationGroupCurrent.weight < 1) {
      this.animationGroupCurrent.animation?.setWeightForAllAnimatables(newWeight)
      this.animationGroupCurrent.weight = newWeight
    } else {
      const count = this.animationGroups.filter((animationGroup) => {
        return animationGroup.name !== this.animationNameCurrent && animationGroup.weight <= 0
      }).length

      if (count === this.animationGroups.length - 1) {
        scene.onBeforeAnimationsObservable.removeCallback(this.observableBeforeAnimation)
      }
    }
  }
  private disableAnimations()
  {
    const transitionSpeed = Helpers.numberFixed(store.getSettings().transitionAnimationSpeed * average, 2)

    this.animationGroups.forEach((animationGroup) => {
      if (animationGroup.name !== this.animationNameCurrent) {
          const newWeight = Scalar.Clamp(animationGroup.weight - transitionSpeed, 0, 1)

          if (animationGroup.weight > 0) {
            animationGroup.weight = newWeight
            animationGroup.animation?.setWeightForAllAnimatables(newWeight)
          } else {
            if (!animationGroup.autoPlayLoop) {
              animationGroup.animation?.stop();
            }
          }
        }
    })
  }

  dispose () {
    //TODO: 123
  }
}

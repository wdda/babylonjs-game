import { AnimationGroup } from '@babylonjs/core'
import { AnimationGroupInterface } from './AnimationGroupInterface'

export default class JumpMiddle implements AnimationGroupInterface {
  animation: AnimationGroup | null
  playerId: string
  weight: number
  autoPlayLoop: boolean
  intervalId: number | null
  name: string

  //TODO: the classes turned out to be very similar, you can inherit these methods from a common class
  constructor (playerId: string) {
    this.playerId = playerId
    this.weight = 0
    this.autoPlayLoop = true
    this.animation = globalThis.scene.getAnimationGroupByName('JumpMiddle_' + playerId)
    this.intervalId = null
    this.name = 'JumpMiddle'

    this.setAnimations()
  }

  setAnimations () {
    if (!this.animation) {
      console.error('Not find JumpMiddle animation')
      return
    }

    this.animation.name = 'JumpMiddle_' + this.playerId
    this.animation.setWeightForAllAnimatables(0)
    this.animation.play(true)
  }
}

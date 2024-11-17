import { AnimationGroup } from '@babylonjs/core'
import { AnimationGroupInterface } from './AnimationGroupInterface'

export default class JumpStart implements AnimationGroupInterface {
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
    this.autoPlayLoop = false
    this.animation = scene.getAnimationGroupByName('JumpStart_' + playerId)
    this.intervalId = null
    this.name = 'JumpStart'

    this.setAnimations()
  }

  setAnimations () {
    if (!this.animation) {
      console.error('Not find JumpStart animation')
      return
    }

    this.animation.name = 'JumpStart_' + this.playerId
    this.animation.setWeightForAllAnimatables(0)
    this.animation.stop()
  }
}

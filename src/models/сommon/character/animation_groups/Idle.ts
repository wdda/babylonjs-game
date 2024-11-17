import { AnimationGroup } from '@babylonjs/core'
import { AnimationGroupInterface } from './AnimationGroupInterface'

export default class Idle implements AnimationGroupInterface {
  playerId: string
  animation: AnimationGroup | null
  weight: number
  autoPlayLoop: boolean
  intervalId: number | null
  name: string

  constructor (playerId: string) {
    this.playerId = playerId
    this.weight = 0
    this.autoPlayLoop = true
    this.animation = scene.getAnimationGroupByName('Idle_' + playerId)
    this.intervalId = null
    this.name = 'Idle'

    this.setAnimations()
  }
  
  setAnimations () {
    if (!this.animation) {
      console.error('Not find Idle animation')
      return
    }

    this.animation.name = 'Idle_' + this.playerId
    this.animation.setWeightForAllAnimatables(0)
    this.animation.play(true)
  }
}

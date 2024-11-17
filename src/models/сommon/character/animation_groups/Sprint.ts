import { AnimationGroup } from '@babylonjs/core'
import { AnimationGroupInterface } from './AnimationGroupInterface'

export default class Sprint implements AnimationGroupInterface {
  animation: AnimationGroup | null
  playerId: string
  weight: number
  autoPlayLoop: boolean
  intervalId: number | null
  name: string
  
  constructor (playerId: string) {
    this.playerId = playerId
    this.weight = 0
    this.autoPlayLoop = true
    this.animation = scene.getAnimationGroupByName('Sprint_' + playerId)
    this.intervalId = null
    this.name = 'Sprint'
    
    this.setAnimations()
  }
  
  setAnimations () {
    if (this.animation === null) {
      console.error('Not find Sprint animation')
      return
    }
    
    this.animation.name = 'Sprint_' + this.playerId
    this.animation.setWeightForAllAnimatables(0)
    this.animation.play(true)
  }
}

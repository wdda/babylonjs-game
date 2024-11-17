import { AnimationGroup } from '@babylonjs/core'
import { AnimationGroupInterface } from './AnimationGroupInterface'

export default class Run implements AnimationGroupInterface {
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
    this.animation = scene.getAnimationGroupByName('Run_' + playerId)
    this.intervalId = null
    this.name = 'Run'
    
    this.setAnimations()
  }
  
  setAnimations () {
    if (this.animation === null) {
      console.error('Not find Run animation')
      return
    }
    
    this.animation.name = 'Run_' + this.playerId
    this.animation.setWeightForAllAnimatables(0)
    this.animation.play(true)
  }
}

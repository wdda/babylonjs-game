import { Scene, KeyboardEventTypes } from '@babylonjs/core'
import store from '@/store/store'
import { Player } from '@/store/types'

export default class Controller {
  sensitiveMouse: number
  mouseIsCaptured: boolean | Element
  store: any
  scene: Scene
  playerId: string
  player: Player
  
  constructor () {
    this.sensitiveMouse = 0.004
    this.mouseIsCaptured = false
    this.scene = globalThis.scene
    this.playerId = store.getSelfPlayerId()
    this.player = store.getSelfPlayer()
    
    this.mouseEvent()
    
    this.scene.onKeyboardObservable.add(event => {
      this.keyEvent(event)
    })
  }
  
  private keyEvent (e: any) {
    const forward = { ...this.player.move.forward }
    
    const eventCode = e.event.code
    const eventType = e.type
    
    if (KeyboardEventTypes.KEYDOWN === eventType) {
      if (eventCode === 'KeyW') {
        forward.front = true
      }
      
      if (eventCode === 'KeyS') {
        forward.back = true
      }
      
      if (eventCode === 'KeyA') {
        forward.left = true
      }
      
      if (eventCode === 'KeyD') {
        forward.right = true
      }
      
      if (eventCode === 'Space') {
        store.setJump(this.playerId, true)
      }
    }
    
    if (KeyboardEventTypes.KEYUP === eventType) {
      if (eventCode === 'KeyW') {
        forward.front = false
      }
      
      if (eventCode === 'KeyS') {
        forward.back = false
      }
      
      if (eventCode === 'KeyA') {
        forward.left = false
      }
      
      if (eventCode === 'KeyD') {
        forward.right = false
      }
      
      if (eventCode === 'Space') {
        store.setJump(this.playerId, false)
      }
    }

    store.setForward(this.playerId, forward)
  }
  
  private mouseEvent () {
    const elementContent = document.getElementById('level') as HTMLElement
    
    elementContent.addEventListener('click', (e) => {
      const checkFocusAvailable = e.composedPath().find((item) => {
        const itemChecked = item as HTMLElement
        if(itemChecked.tagName !== undefined) {
          return itemChecked.classList.contains('no_focus_game')
        }
        
        return false
      })
      
      if (!checkFocusAvailable) {
        this.mouseIsCaptured = true
        const canvas = document.getElementById('canvas')
        
        if (canvas) {
          canvas.requestPointerLock()
        }
      }
      
    })
    
    const pointerlockchange = () => {
      this.mouseIsCaptured = document.pointerLockElement || false
    }
    
    document.addEventListener('pointerlockchange', pointerlockchange, false)
    
    window.addEventListener('pointermove', (e) => {
      if (this.mouseIsCaptured) {
        const rotateX = e.movementY * this.sensitiveMouse
        const rotateY = e.movementX * this.sensitiveMouse
        store.setRotate(this.playerId, rotateX, rotateY)
      }
    })
  }
}

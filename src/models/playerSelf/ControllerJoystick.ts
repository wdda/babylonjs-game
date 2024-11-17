import store from '@/store/store'
import { JoystickManagerOptions } from 'nipplejs'
import { isEqual } from 'lodash'
import {Forward, Player} from '@/store/types'

export default class ControllerJoystick {
  lastEventMove: string
  playerId: string
  player: Player

  constructor () {
    this.lastEventMove = ''
    this.playerId = store.getSelfPlayerId()
    this.player = store.getSelfPlayer()

    this.setRotate()
  }

  setForward (nippleData: any) {
    const distance = nippleData.distance

    const oldForward = store.getSelfPlayer().move.forward
    const direction = this.getDirection(nippleData.angle.degree)

    const forward: Forward = {
      right: direction.right,
      front: direction.front,
      left: direction.left,
      back: direction.back,
      sprint: distance > 40,
      isMoving: false
    }

    if (!isEqual(forward, oldForward)) {
      store.setForward(this.playerId, forward)
    }
  }

  moveEnd () {
    store.setForward(this.playerId, {
      left: false,
      right: false,
      back: false,
      front: false,
      isMoving: false,
      sprint: false
    })
  }

  getDirection(deg: number)
  {
    return {
      front: deg >= 22.5 && deg < 157.5,
      back: deg >= 202.5 && deg < 337.5,
      left: deg >= 112.5 && deg < 247.5,
      right: deg >= 292.5 || deg < 67.5
    }
  }

  getOptionsMove () {
    return {
      zone: document.getElementById('controller_box_move'),
      color: '#fa72d3',
      mode: 'static',
      position: {
        right: '50px',
        top: '50px'
      }
    } as JoystickManagerOptions
  }

  setJumpButton() {
    const jumpButton = document.getElementById('controller_button_jump') as HTMLElement

    jumpButton.addEventListener('touchstart',  () => {
      jumpButton.classList.add("active")
      store.setJump(this.playerId, true)
    })

    jumpButton.addEventListener('touchend',  () => {
      jumpButton.classList.remove("active")
      store.setJump(this.playerId, false)
    })
  }

  setRotate() {
    const moveArea = document.getElementById('controller') as HTMLElement
    let previousTouchX = 0
    let previousTouchY = 0

    moveArea.addEventListener('touchstart',  (event) => {
      const touches = Array.from(event.touches)

      const touch = touches.find(touchElement => {
        return touchElement.target == moveArea
      })

      if (touch == undefined) {
        return
      }

      previousTouchX = touch.clientX
      previousTouchY = touch.clientY
    })

    moveArea.addEventListener("touchmove", (event) => {
      const touches = Array.from(event.touches)

      const touch = touches.find(touchElement => {
        return touchElement.target == moveArea
      })

      if (touch == undefined) {
        return
      }

      const currentTouchX = touch.clientX
      const currentTouchY = touch.clientY

      const movementX = currentTouchX - previousTouchX
      const movementY = currentTouchY - previousTouchY

      store.setRotate(this.playerId, movementY / 50, movementX / 80)

      previousTouchX = currentTouchX
      previousTouchY = currentTouchY
    })
  }
}
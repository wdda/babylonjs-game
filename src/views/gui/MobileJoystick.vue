<template>
    <div id="controller">
      <div id="controller_jump">
        <div id="controller_box_jump">
          <div id="controller_button_jump"></div>
        </div>
      </div>
      <div id="controller_move">
        <div id="controller_box_move"></div>
      </div>
    </div>
</template>

<style>
    #controller {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      user-select: none;
    }

    #controller_move {
        padding: 0;
        margin: 0;
        position: absolute;
        bottom: 10%;
        left: 0;
        width: 150px;
        height: 100px;
        z-index: 3;
        display: flex;
        flex-wrap: wrap;
    }

    #controller_jump {
      padding: 0;
      margin: 0;
      position: absolute;
      bottom: 10%;
      right: 0;
      width: 150px;
      height: 100px;
      z-index: 3;
      display: flex;
      flex-wrap: wrap;
    }

    #controller_box_jump {
      width: 100%;
      height: 100%;
      position: relative;
    }

    #controller_button_jump {
      background: #3dc2ff;
      border-radius: 50%;
      opacity: 0.3;
      margin-right: -50px;
      margin-top: -50px;
      width: 100px;
      height: 100px;
      position: absolute;
      left: 0;
      top: 50px;
      animation: bounceIn 3s;
      transition: all 0.3s ease-out
    }

    #controller_button_jump.active {
      opacity: 0.5;
    }

    #controller_box_move {
        position: relative;
        flex: 1;
        animation: bounceIn 3s;
    }

    @keyframes bounceIn {
        from { opacity: 0; }
        to   { opacity: 1; }
    }
</style>

<script lang="ts">
  import { defineComponent } from 'vue'
  import * as nipples from 'nipplejs'
  import ControllerJoystick from '@/models/playerSelf/ControllerJoystick'

  export default defineComponent({
    name: 'MobileJoystick',
    mounted () {
      this.$nextTick(() => {
        setTimeout(() => {
          this.initJoystick()

        }, 3000)
      })
    },
    methods: {
      initJoystick() {
        const controller = new ControllerJoystick()

        this.$nextTick(() => {
          const optionsMove = controller.getOptionsMove()
          let joystickMove = nipples.create(optionsMove)


          this.initMove(joystickMove, controller)

          window.addEventListener('orientationchange', () => {
            joystickMove.destroy()
            joystickMove = nipples.create(optionsMove)

            this.initMove(joystickMove, controller)
          }, false)

          controller.setJumpButton()
        })
      },
      initMove(joystick: nipples.JoystickManager, controller: ControllerJoystick) {
        joystick.on('move', (evt, data) => {
          if (typeof data.direction == 'undefined') {
            return false
          }

          controller.setForward(data)
        })

        joystick.on('end', () => {
          controller.moveEnd()
        })
      }
    }
  })

</script>
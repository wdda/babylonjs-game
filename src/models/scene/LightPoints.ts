import {
  PointLight,
  Scene,
  Vector3,
  Animation,
  AbstractMesh,
} from '@babylonjs/core'
import store from '@/store/store'
import {Helpers} from "@/models/Helpers"

interface CustomPointLight extends PointLight {
  userActivationRadius?: number
  userIntensity?: number
}

export default class LightPoints {
  meshFoot: AbstractMesh | null
  scene: Scene
  intensity: number
  radius: number
  maxLights: number
  sceneLights: Array<CustomPointLight>
  collectManagerLight: Array<any>

  constructor () {
    this.meshFoot = globalThis.scene.getMeshById('playerFoot_' + store.getSelfPlayer().id)
    this.scene = globalThis.scene
    this.intensity = 300
    this.radius = 15
    this.maxLights = 5
    this.sceneLights = []
    this.collectManagerLight = []
  }

  extractNumber(str: string, name: string): number | null {
    const regex = new RegExp(`${name}_(\\d+(?:\\.\\d+)?)`)
    const match = str.match(regex)
    if (match && match[1]) {
      return parseFloat(match[1])
    }
    return null
  }

  setupLights () {
    const lights = [...this.scene.lights.filter(light => light.id !== 'playerLightShadow' && (light instanceof PointLight))]

    lights.forEach(light => {
      const intensityInName = this.extractNumber(light.name, 'intensity')
      const activationRadius = this.extractNumber(light.name, 'distance') || this.radius
      const intensity = intensityInName ? intensityInName : this.intensity

      ;(light as CustomPointLight).userActivationRadius = activationRadius
      ;(light as CustomPointLight).userIntensity = intensity
      ;(light as CustomPointLight).intensity = intensity

      if (!Helpers.IsName(light.name, 'no_disable', true)) {
        this.sceneLights.push(light as CustomPointLight)
        this.scene.removeLight(light)
      }
    })

    if (!this.sceneLights.length) {
      console.info('Not set light points for class LightPoints')
      return null
    }

    let i = 0
    while (this.maxLights > i && this.sceneLights.length >= i) {
      const light = new PointLight('pointLight' + i, new Vector3(0, 0, 0), this.scene)
      light.intensity = 0

      const animation = new Animation('lightAnimation' + i, 'intensity', 30, Animation.ANIMATIONTYPE_FLOAT)

      this.collectManagerLight.push({
        animated: false,
        refId: null,
        light,
        animation,
        animationPlay: null,
        targetIntensity: 0
      })

      i++
    }

    this.scene.materials.forEach((material: any) => {
      material.maxSimultaneousLights = this.maxLights
    })

    setInterval(() => {
      this.runLights()
    }, 200)
  }

  private animateEnable (item: any) {
    const light = item.light
    const targetIntensity = item.targetIntensity
    item.animated = true

    if (item.animationPlay) {
      item.animationPlay.pause()
    }

    const keys = []
    keys.push({ frame: 0, value: light.intensity })
    keys.push({ frame: 100, value: targetIntensity })
    item.animation.setKeys(keys)
    light.animations[0] = item.animation

    item.animationPlay = this.scene.beginAnimation(light, 0, 100, false, 1, () => {
      item.animated = false
    })
  }

  private animateDisabled (item: any) {
    const light = item.light
    const frames = 15

    item.animated = true

    if (item.animationPlay) {
      item.animationPlay.pause()
    }

    const keys = []
    keys.push({ frame: 0, value: light.intensity })
    keys.push({ frame: frames, value: 0 })
    item.animation.setKeys(keys)
    light.animations[0] = item.animation

    item.animationPlay = this.scene.beginAnimation(light, 0, frames, false, 1, () => {
      item.animated = false
      item.refId = null
    })
  }

  private runLights() {
    if (!this.meshFoot) {
      throw 'Not set mesh foot'
    }

    const meshFootPosition = this.meshFoot.getAbsolutePosition()

    this.sceneLights.sort((a, b) => {
      const distA = a.position.subtract(meshFootPosition).length()
      const distB = b.position.subtract(meshFootPosition).length()
      const activationA = a.userActivationRadius || this.radius
      const activationB = b.userActivationRadius || this.radius

      const priorityA = distA / activationA
      const priorityB = distB / activationB

      return priorityA - priorityB
    })

    let i = 0
    while (this.maxLights > i && i < this.sceneLights.length) {
      const sceneLight = this.sceneLights[i]
      const lightPosition = sceneLight.getAbsolutePosition()

      const dx = Math.abs(lightPosition.x - meshFootPosition.x)
      const dy = Math.abs(lightPosition.y - meshFootPosition.y)
      const dz = Math.abs(lightPosition.z - meshFootPosition.z)

      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
      const activationRadius = sceneLight.userActivationRadius || this.radius
      const itemSearch = this.collectManagerLight.find(item => item.refId === sceneLight.id)

      if (dist <= activationRadius) {
        if (!itemSearch) {
          const freeItem = this.collectManagerLight.find(item => !item.refId)

          if (freeItem) {
            freeItem.refId = sceneLight.id
            freeItem.targetIntensity = sceneLight.userIntensity || this.intensity

            const light = freeItem.light
            light.position = sceneLight.position
            light.range = sceneLight.range
            light.radius = sceneLight.radius
            light.specular = sceneLight.specular
            light.diffuse = sceneLight.diffuse

            this.animateEnable(freeItem)
          }
        }
      } else {
        if (itemSearch) {
          this.animateDisabled(itemSearch)
        }
      }

      i++
    }
  }
}

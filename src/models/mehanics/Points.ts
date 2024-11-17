import { Mesh, Vector3, ParticleSystem, Texture, Color4 } from '@babylonjs/core'
import store from '@/store/store'

export default class Points {
  meshFoot: Mesh
  points: Mesh[]
  playerId: string
  particleSystem?: ParticleSystem
  particleLifeTime: number
  removePointIntervalId?: number

  constructor (playerId: string) {
    this.meshFoot = globalThis.scene.getMeshById('playerFoot_' + playerId) as Mesh
    this.points = globalThis.scene.getMeshesByTags('point_energy')
    this.playerId = playerId
    this.particleLifeTime = 0

    this.init()
  }

  init() {
    this.points.forEach((point: Mesh) => {
      point.isVisible = false
      const meshes = point.getChildMeshes() as Mesh[]
      const pointBody = meshes[0]
      point.metadata = { attracted: false, run: false, originCoordinate: {x: point.position.x, y: point.position.y, z: point.position.z} }

      pointBody.animations.forEach((anim) => {
        const range = anim.getRange('default') || { from: 0, to: 100 }
        const fromFrame = range.from
        const toFrame = range.to
        const loop = true
        const randomOffset = Math.floor(Math.random() * (toFrame - fromFrame))
        const animatable = globalThis.scene.beginAnimation(pointBody, fromFrame, toFrame, loop)

        if (animatable) {
          animatable.goToFrame(randomOffset)
        }
      })
    })

    this.run()
  }

  private run() {
    setInterval(() => {
      this.points
      .filter((point: Mesh) => !point.metadata?.attracted)
      .forEach((point: Mesh) => {
        if (point.position.subtract(this.meshFoot.position).length() < 4) {
          if (!point.metadata.run) {
            point.metadata.attracted = true
            this.updateEmitRate()
          }
        }
      })
    }, 100)

    globalThis.scene.onBeforeRenderObservable.add(() => {
      this.points.forEach((point: Mesh) => {
        if (point.metadata?.attracted && !point.metadata.run) {
          const directionToPlayer = this.meshFoot.position.subtract(point.position).normalize()
          const speed = Math.max(0.2, point.position.subtract(this.meshFoot.position).length() / 20)
          point.position.addInPlace(directionToPlayer.scale(speed * globalThis.average))

          if (point.position.subtract(this.meshFoot.position).length() < 0.5) {
            const meshes = point.getChildMeshes() as Mesh[]
            const pointBody = meshes[0]

            point.metadata.run = true
            point.metadata.attracted = false
            pointBody.isVisible = false

            if (!this.particleSystem) {
              this.createParticleSystem()
            }

            store.addPoint(this.playerId, 1)
            this.updateEmitRate()
            this.particleSystem?.start()

            clearInterval(this.removePointIntervalId)
            this.removePointInterval()

            setTimeout(() => {
              point.position.x = point.metadata.originCoordinate.x
              point.position.y = point.metadata.originCoordinate.y
              point.position.z = point.metadata.originCoordinate.z

              point.metadata.run = false
              point.metadata.attracted = false
              pointBody.isVisible = true
            }, 5000)
          }
        }
      })
    })
  }

  private removePointInterval()
  {
    this.removePointIntervalId = setInterval(() => {
      if (store.getCountPoint(this.playerId)) {
        store.removePoint(this.playerId, 1)
        this.updateEmitRate()
      }

      if (store.getCountPoint(this.playerId) <= 0) {
        this.particleSystem?.stop()
      }
    }, 1800)
  }

  private updateEmitRate() {
    const activePointsCount = store.getCountPoint(this.playerId)

    if (this.particleSystem) {
      this.particleSystem.emitRate = 20 * activePointsCount;
    }
  }

  createParticleSystem() {
    this.particleSystem = new ParticleSystem('disappearanceEffect', 100, globalThis.scene)

    this.particleSystem.particleTexture = new Texture("./resources/graphics/textures/flower.png", globalThis.scene)
    this.particleSystem.blendMode = ParticleSystem.BLENDMODE_STANDARD

    this.particleSystem.emitter = this.meshFoot

    this.particleSystem.minSize = 0.03
    this.particleSystem.maxSize = 0.15

    this.particleSystem.minEmitPower = 0.1
    this.particleSystem.maxEmitPower = 0.5

    this.particleSystem.minAngularSpeed = -Math.PI
    this.particleSystem.maxAngularSpeed = Math.PI
    this.particleSystem.minInitialRotation = 0
    this.particleSystem.maxInitialRotation = 2 * Math.PI

    this.particleSystem.direction1 = new Vector3(-5, 5, -5)
    this.particleSystem.direction2 = new Vector3(5, 5, 5)

    this.particleSystem.minLifeTime = 0.5
    this.particleSystem.maxLifeTime = 1

    this.particleSystem.colorDead = new Color4(1, 1, 1, 0); // Белый и полностью прозрачный

    this.particleSystem.start()

    this.particleLifeTime = 3000
  }
}

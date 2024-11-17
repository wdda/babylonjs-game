import {
    AbstractMesh,
    Mesh,
    Nullable,
    Observer,
    Scalar,
    Scene,
    Vector3
} from "@babylonjs/core"
import {Forward, Player} from "@/store/types"
import store from "@/store/store"
import {Helpers} from "@/models/Helpers"
import RayCastHead from "@/models/сommon/rayCast/RayCastHead"
import JumpPad from "@/models/mehanics/JumpPad"

export default class Jump {
    meshFoot: Mesh
    meshHead: Mesh
    player: Player
    observerBefore?: Nullable<Observer<Scene>>
    lastForward: Forward
    jumpRunning: boolean
    inertiaRunning: boolean
    startHeight: number
    height: number
    speedRatio: number
    nextStep: Vector3
    rayCast: RayCastHead
    lastJumpTime: number

    constructor(playerId: string) {
        this.meshFoot = globalThis.scene.getMeshById('playerFoot_' + playerId) as Mesh
        this.meshHead = globalThis.scene.getMeshById('playerHead_' + playerId) as Mesh
        this.player = store.getPlayer(playerId)
        this.lastForward = { ...this.player.move.forward }
        this.jumpRunning = false
        this.inertiaRunning = false
        this.startHeight = 0
        this.height = 0
        this.speedRatio = 0.2
        this.nextStep = Vector3.Zero()
        this.rayCast = new RayCastHead(this.meshFoot)
        this.lastJumpTime = 0

        new JumpPad(this)

        this.subscribe()

        this.observerBefore = globalThis.scene.onAfterRenderObservable.add(() => {
            this.beforeRender()
        })
    }

    subscribe() {
        store.subscribe(this.player.id, (type: string, value: boolean) => {
            const currentTime = new Date().getTime()

            if (type === 'jump' && value) {
                if (!this.player.move.isFlying && !this.jumpRunning && currentTime - this.lastJumpTime > 400) {
                    this.lastJumpTime = currentTime
                    let jumpHeight = store.getSettings().jumpHeight

                    if (this.player.points) {
                        jumpHeight = store.getSettings().jumpHeightSprint
                    }

                    store.setJumpStart(this.player.id)
                    this.jumpEnable(jumpHeight)
                }
            }
        })

        store.subscribe(this.player.id, (type: string, value: any) => {
            if (type === 'isFlying' && value === false) {
                this.inertiaRunning = false
                this.jumpRunning = false
                store.setJumpRunning(this.player.id, false)
            }
        })
    }

    jumpEnable (height:number, speedRatio = 1) {
        if (this.player.move.isFlying || this.jumpRunning) {
            return
        }

        this.startHeight = this.meshFoot.position.y
        this.jumpRunning = true

        const speedMove = this.player.move.speed

        this.height = height + speedMove

        this.speedRatio = speedRatio
        this.lastForward = { ...this.player.move.forward }
        this.inertiaRunning = true

        store.setJumpRunning(this.player.id, true)
    }

    private jumpRun() {
        if (this.jumpRunning) {
            const currentHeight = Helpers.numberFixed(this.meshFoot.position.y, 3)
            const finishHeight = Helpers.numberFixed(this.startHeight + this.height, 3)

            if (currentHeight < finishHeight && currentHeight != finishHeight) {
                const speed = this.speedRatio

                // Calculate the remaining distance to the finish height
                const remainingDistance = finishHeight - currentHeight

                // Calculate the factor to slow down the speed as the remaining distance decreases
                const slowdownFactor = (remainingDistance / this.height)

                // Calculate the adjusted speed by multiplying the speed with the slowdown factor§
                let adjustedSpeed = speed * slowdownFactor

                const adjustedSpeedMin = 0.03
                const adjustedSpeedMax = 0.4

                adjustedSpeed = Scalar.Clamp(adjustedSpeed, adjustedSpeedMin, adjustedSpeedMax)

                this.nextStep.y = Helpers.numberFixed(adjustedSpeed * average, 5)
            } else {
                this.jumpRunning = false
                store.setJumpRunning(this.player.id, false)
            }
        }
    }

    private inertiaRun() {
        let speed = this.height / 80

        speed = Helpers.numberFixed(speed * average, 5)

        if (this.lastForward.front) {
            this.nextStep.z = speed
        }

        if (this.lastForward.back) {
            this.nextStep.z = -speed
        }

        if (this.lastForward.left) {
            this.nextStep.x = -speed
        }

        if (this.lastForward.right) {
            this.nextStep.x = speed
        }
    }

    private setNewPosition () {
        if (this.nextStep.x || this.nextStep.y || this.nextStep.z) {
            const matrix = this.meshFoot.getWorldMatrix()
            const vector = Vector3.TransformNormal(this.nextStep, matrix)
            this.meshFoot.moveWithCollisions(vector)
        }
    }

    private checkHeadRay() {
        const point = this.rayCast.cast((mesh: AbstractMesh) => {
            return mesh.checkCollisions && mesh.isEnabled()
        })

        if (point) {
            this.jumpRunning = false
            store.setJumpRunning(this.player.id, false)
        }
    }

    private beforeRender() {
        if (this.jumpRunning || this.inertiaRunning) {
            this.nextStep = Vector3.Zero()

            if (this.jumpRunning) {
                this.jumpRun()
            }

            if (this.inertiaRunning && this.player.move.isFlying) {
                this.inertiaRun()
            }

            this.setNewPosition()

            this.checkHeadRay()
        }
    }

    dispose (){
        if (this.observerBefore) {
            globalThis.scene.onBeforeRenderObservable.remove(this.observerBefore)
        }
    }
}
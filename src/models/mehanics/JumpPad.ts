import Jump from "@/models/сommon/Jump"
import RayCastFootFour from "@/models/сommon/rayCast/RayCastFootFour"
import { Helpers } from "@/models/Helpers"
import {Mesh, Nullable, Observer, Scene} from "@babylonjs/core"
import store from "@/store/store"

export default class JumpPad {
    observerBefore?: Nullable<Observer<Scene>>
    isJump: boolean
    height: number
    meshFoot: Mesh
    jumpClass: Jump

    constructor(jump: Jump) {
        this.jumpClass = jump
        this.meshFoot = globalThis.scene.getMeshById('playerFoot_' + jump.player.id) as Mesh
        this.isJump = false
        this.height = 2
        
        this.init()

        this.observerBefore = globalThis.scene.onAfterRenderObservable.add(() => {
            this.beforeRender()
        })
    }

    private init()
    {
        setInterval(() => {
            if (!this.isJump) {
                const rayCast = new RayCastFootFour(this.meshFoot)
                const pickInfo = rayCast.cast((mesh: any) => {
                    return Helpers.hasTag(mesh, 'jump_pad')
                })
                
                if (pickInfo) {
                    const height = store.getSettings().jumpHeight * this.height
                    this.jumpClass.jumpEnable(height, 3)
                    this.isJump = true
                }
            }
           
        }, 50)
    }

    private beforeRender() {
        if (this.isJump && !this.jumpClass.player.move.isFlying && !this.jumpClass.player.move.jumpStart) {
            this.isJump = false
        }
    }
}
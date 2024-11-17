import {Mesh, Tools} from "@babylonjs/core"
import store from "@/store/store"
import {Player} from "@/store/types";

export default class Rotation {
    meshFoot: Mesh
    meshHead: Mesh
    player: Player

    constructor(playerId: string) {
        this.meshFoot = globalThis.scene.getMeshById('playerFoot_' + playerId) as Mesh
        this.meshHead = globalThis.scene.getMeshById('playerHead_' + playerId) as Mesh
        this.player = store.getPlayer(playerId)

        this.subscribe()
    }

    private subscribe() {
        store.subscribe(this.player.id, (type: string) => {
            if (type === 'rotate') {
                this.rotate()
            }
        })
    }

    private rotate() {
        const rotate = this.player.move.rotate
        const rotateX = rotate.x
        const rotateY = rotate.y

        this.meshHead.rotation.x += rotateX * average
        this.meshFoot.rotation.y += rotateY * average

        if (this.meshHead.rotation.x > Tools.ToRadians(90)) {
            this.meshHead.rotation.x = Tools.ToRadians(90)
        }

        if (this.meshHead.rotation.x < -Tools.ToRadians(45)) {
            this.meshHead.rotation.x = -Tools.ToRadians(45)
        }
    }
}

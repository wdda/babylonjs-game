import {Mesh, PickingInfo, Ray, RayHelper, Vector3} from "@babylonjs/core"

export default class RayCastMesh {
    offsetX: number
    offsetZ: number
    offsetY: number
    rayCastLength: number
    mesh: Mesh
    enableRenderRay: boolean
    scale: number

    constructor(mesh: Mesh) {
        this.offsetX = 0
        this.offsetZ = 0
        this.rayCastLength = 0.3
        this.offsetY = 0
        this.mesh = mesh
        this.enableRenderRay = false
        this.scale = -1
    }

    public setOffsetX(offsetX: number) {
        this.offsetX = offsetX
    }

    public setOffsetY(offsetY: number) {
        this.offsetY = offsetY
    }

    public setOffsetZ(offsetZ: number) {
        this.offsetZ = offsetZ
    }

    public setRayCastLength(length: number) {
        this.rayCastLength = length
    }

    public setEnableRenderRay() {
        this.enableRenderRay = true
    }

    public cast(predicate: any): PickingInfo | null {
        const pointStart = new Vector3(
            this.mesh.position.x + this.offsetX,
            this.mesh.position.y + this.offsetY,
            this.mesh.position.z + this.offsetZ
        );

        const ray = new Ray(pointStart, Vector3.Up().scale(this.scale), this.rayCastLength);

        if (this.enableRenderRay) {
            const rayHelper = new RayHelper(ray)
            rayHelper.show(globalThis.scene)

            setTimeout(() => {
                rayHelper.dispose()
            }, 100)
        }

        const pick = globalThis.scene.pickWithRay(ray, predicate)
        return pick && pick.hit && pick.pickedPoint ? pick : null
    }
}
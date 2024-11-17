import RayCastMesh from "@/models/сommon/rayCast/RayCastMesh"
import {Mesh} from "@babylonjs/core"

export default class RayCastHead extends RayCastMesh {
    constructor(meshFoot: Mesh) {
        super(meshFoot)

        const boundingInfo = meshFoot.getBoundingInfo()
        const footHeight = boundingInfo.maximum.y - boundingInfo.minimum.y
        this.rayCastLength = (footHeight / 2) + 0.05
        this.offsetY = 0
        this.scale = 1

        this.enableRenderRay = false
    }
}
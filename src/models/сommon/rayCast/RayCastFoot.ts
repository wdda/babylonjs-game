import RayCastMesh from "@/models/сommon/rayCast/RayCastMesh"
import { Mesh } from "@babylonjs/core"

export default class RayCastFoot extends RayCastMesh {
    constructor(meshFoot: Mesh) {
        super(meshFoot)

        const boundingInfo = meshFoot.getBoundingInfo()
        const footHeight = boundingInfo.maximum.y - boundingInfo.minimum.y
        this.rayCastLength = (footHeight / 2) + 0.1
        this.offsetY = 0

        this.enableRenderRay = false
    }
}

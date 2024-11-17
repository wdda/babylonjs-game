import { Mesh } from "@babylonjs/core"
import RayCastFoot from "@/models/сommon/rayCast/RayCastFoot";

export default class RayCastFootTwo extends RayCastFoot {
    constructor(meshFoot: Mesh) {
        super(meshFoot)

        this.offsetX = 0.2
    }
}

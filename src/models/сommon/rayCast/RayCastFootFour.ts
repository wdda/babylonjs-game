import { Mesh } from "@babylonjs/core"
import RayCastFoot from "@/models/сommon/rayCast/RayCastFoot";

export default class RayCastFootFour extends RayCastFoot {
    constructor(meshFoot: Mesh) {
        super(meshFoot)

        this.offsetZ = 0.2
    }
}

import { Mesh } from "@babylonjs/core"
import RayCastFoot from "@/models/сommon/rayCast/RayCastFoot";

export default class RayCastFootThree extends RayCastFoot {
    constructor(meshFoot: Mesh) {
        super(meshFoot)

        this.offsetZ = -0.2
    }
}

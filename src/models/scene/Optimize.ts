import {AbstractMesh} from "@babylonjs/core"
import {Helpers} from "@/models/Helpers";

export default class Optimize {
    static setMeshes(meshes: Array<AbstractMesh>) {
        meshes.forEach(mesh => {
            if (!Helpers.hasTag(mesh, 'animate')) {
                mesh.freezeWorldMatrix()
                mesh.doNotSyncBoundingInfo = true
                mesh.cullingStrategy = AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY
                mesh.isPickable = false
                mesh.material?.freeze()
            }
        })
    }
}
import {
  MeshBuilder,
  Vector3,
  Observer,
  Nullable,
  Scene,
  AbstractMesh,
  Tags,
} from '@babylonjs/core'

export default class Body {
  playerId: string
  meshHeadId: string
  meshFootId: string
  observer: Nullable<Observer<Scene>>
  
  constructor (playerId: string) {
    this.playerId = playerId
    this.meshHeadId = 'playerHead_' + playerId
    this.meshFootId = 'playerFoot_' + playerId
    this.observer = null
    this.add()
  }
  
  private add () {
    const size = 0.25
    const footWidth = 0.6
    const footHeight = 1.78
    const footDepth = 0.6

    const meshHead = MeshBuilder.CreateBox(this.meshHeadId, { size: size }, scene)
    const meshFoot = MeshBuilder.CreateBox(this.meshFootId, { width: footWidth, height: footHeight, depth: footDepth }, scene)

    meshFoot.ellipsoid = new Vector3(footWidth / 2, footHeight / 2, footDepth / 2)

    meshHead.rotation.x = 0
    meshHead.rotation.z = 0
    meshFoot.position.y = 10

    Tags.AddTagsTo(meshFoot, 'foot')
  
    const meshCoordinator = scene.getMeshById('player') as AbstractMesh

    if (meshCoordinator) {
      meshFoot.position.z = meshCoordinator.position.z
      meshFoot.position.x = meshCoordinator.position.x
      meshFoot.position.y = meshCoordinator.position.y
      meshCoordinator.visibility = 0
    }

    meshFoot.rotation = new Vector3()

    meshHead.visibility = 0
    meshFoot.visibility = 0

    meshHead.checkCollisions = false
    meshFoot.checkCollisions = false

    meshHead.isPickable = false
    meshFoot.isPickable = false

   this.observer = scene.onBeforeRenderObservable.add(() => {
      meshHead.position.x = meshFoot.position.x
      meshHead.position.y = meshFoot.position.y + 1.2
      meshHead.position.z = meshFoot.position.z

      meshHead.rotation.y = meshFoot.rotation.y
    })
  }
  
  dispose () {
    if (this.observer !== null) {
      scene.onBeforeRenderObservable.remove(this.observer)
    }
  }
}

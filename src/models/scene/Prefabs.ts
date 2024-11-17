import { AbstractMesh, InstantiatedEntries, Mesh, Scene } from '@babylonjs/core'
import ContainerManager from '@/models/scene/ContainerManager'

export interface PrefabItem {
  id: number;
  container: InstantiatedEntries;
}

export default class Prefabs {
  prefabs: AbstractMesh[]
  scene: Scene
  
  constructor (callback: any) {
    this.scene = globalThis.scene
    this.prefabs = []
    
    this.setPrefabs()
    this.setItems().then(() => {
      callback()
    })
  }
  
  private setPrefabs () {
    const meshes = this.scene.getMeshesByTags('prefab')

    console.log(meshes)
  
    meshes.forEach(mesh => {
      mesh.isVisible = false
      mesh.isPickable = false
      mesh.isEnabled(false)
      this.prefabs.push(mesh)
    })
  }
  
  private async setItems() {
    let id = 0

    for (const prefab of this.prefabs) {
      const nameModel = `Prefab_${prefab.id.replace(/\.[^/.]+$/, '')}.gltf`
      const path = `${process.env.VUE_APP_RESOURCES_PATH}graphics/prefabs/`

      try {
        const container = await ContainerManager.getContainer(nameModel, path)

        if (!container) {
          console.error(`Error loading container ${nameModel}:`)
          continue
        }

        const rootNode = container.rootNodes[0] as Mesh
        const meshes = rootNode.getChildMeshes()
        rootNode.parent = prefab
        globalThis.collisions.appendCollisionByMeshes(meshes)

        prefab.id = 'prefab_' + id

        const loopAnimation = container.animationGroups.find(group => group.name === 'start')

        if (loopAnimation) {
          loopAnimation.play(true)
        }

        id++

      } catch (error) {
        console.error(`Error loading container ${nameModel}:`, error)
      }
    }
  }
}
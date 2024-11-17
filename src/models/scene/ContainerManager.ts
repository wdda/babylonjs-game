import { AssetContainer, InstantiatedEntries, Mesh, SceneLoader, Tags } from '@babylonjs/core'
import { Helpers } from '@/models/Helpers'
import LODs from '@/models/scene/LODs'
import Materials from '@/models/scene/Materials'

export interface Container {
  name: string
  data: AssetContainer
}

export default class ContainerManager {
  static async getContainer(name: string, path: string): Promise<InstantiatedEntries | null> {
    const filePath = path + name;
    
    if (!Helpers.isFile(filePath)) {
      console.error('Not found file container: ' + filePath)
      return null
    }
    
    const container = globalThis.assetContainers.find((container: Container) => container.name === name)
    
    if (container) {
      return this.getInstance(container.data)
    }
    
    // const timestamp = await Helpers.getFileTimestamp(filePath)
  
    const loadedContainer = await SceneLoader.LoadAssetContainerAsync(path, name, globalThis.scene)
    
    if (loadedContainer) {
      LODs.addLevels(loadedContainer.meshes)
      await Materials.addMaterial(loadedContainer.meshes)

      loadedContainer.removeAllFromScene()
      
      const newContainer = { name, data: loadedContainer }
      globalThis.assetContainers.push(newContainer)

      return this.getInstance(newContainer.data)
    }

    return null
  }
  
  static getInstance(assetContainer: AssetContainer)
  {
    const result = assetContainer.instantiateModelsToScene((name) => {
      return name
    }, false, { doNotInstantiate: false })
    
    const meshes = result.rootNodes[0].getChildMeshes()
  
    meshes.forEach(mesh => {
      const assetMesh = assetContainer.meshes.find(assetMesh => assetMesh.name === mesh.name) as Mesh
      
      if (assetMesh) {
        const tags = Tags.GetTags(assetMesh)
        Tags.AddTagsTo(mesh, tags)
      }
    })

    LODs.showOnlyMainLod(meshes)

    /*if (!assetContainer.animationGroups.length) {
      Optimize.setMeshes(meshes)
    }*/
    
    return result
  }
}

import { AbstractMesh, Mesh } from '@babylonjs/core'
import { Helpers } from '@/models/Helpers'
import { sortBy } from 'lodash'

interface LOD {
  mesh: any
  distance: number
}

export default class LODs {
  static getLODs(meshes: Array<AbstractMesh>)
  {
    const arrayLODs = [] as Array<LOD>

    meshes.forEach(mesh => {
      const tags = Helpers.getTagsFromMesh(mesh)

      if (!tags || !tags.find((tag: string) => tag === 'lod')) {
        return
      }
    
      const tagDistance = tags.find((tag: string) => tag.indexOf('distance') !== -1)
      const distance = tagDistance ? Number(tagDistance.split('_')[1]) : 0
    
      mesh.isVisible = false
  
      arrayLODs.push({
        mesh: mesh,
        distance: distance
      })
    })
    
    return sortBy(arrayLODs, 'distance').reverse()
  }
  
  static addLevels(meshes: Array<AbstractMesh>) {
    const arrayLODs = LODs.getLODs(meshes) as Array<LOD>
    
    if (arrayLODs.length) {
      const mainLod = arrayLODs[0]
      const mainLODMesh = mainLod.mesh as Mesh
      
      mainLODMesh.useLODScreenCoverage = false
      
      for (let i = 1; i < arrayLODs.length; i++) {
        const LOD = arrayLODs[i]
        mainLODMesh.addLODLevel(LOD.distance, LOD.mesh)
      }
  
      mainLod.mesh.addLODLevel(mainLod.distance, null)
    }
  }
  
  static showOnlyMainLod(meshes: Array<AbstractMesh>) {
    const arrayLODs = LODs.getLODs(meshes)
    
    if (arrayLODs.length) {
      arrayLODs.forEach((LOD) => {
        LOD.mesh.isVisible = false
      })
  
      arrayLODs[0].mesh.isVisible = true
    }
  }
}

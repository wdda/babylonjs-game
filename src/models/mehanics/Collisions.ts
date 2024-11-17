import {AbstractMesh, Scene, Tags} from '@babylonjs/core'
import { Helpers } from '@/models/Helpers'

export default class Collisions {
  listCollisions: AbstractMesh[]
  scene: Scene

  constructor () {
    this.scene = globalThis.scene
    this.listCollisions = []
    
    this.setCollisions()
  }
  
  private setCollisions()
  {
    this.listCollisions = this.scene.meshes.filter(mesh => mesh.checkCollisions || Helpers.hasTag(mesh, 'collision'))
    
    this.listCollisions.forEach((mesh) => {
      mesh.isVisible = false
      mesh.isPickable = true
    })
  
    this.scene.getMeshesByTags('visible_force').forEach((mesh) => {
      mesh.isVisible = true
    })

    this.scene.getMeshesByTags('invisible').forEach((mesh) => {
      mesh.isVisible = false
    })
  }
  
  private static checkCollisionList(mesh: AbstractMesh, list: Array<AbstractMesh>)
  {
    for (const keyMesh in list) {
      const listMesh = list[keyMesh]
      
      if (listMesh !== mesh && mesh.intersectsMesh(listMesh, Tags.MatchesQuery(listMesh, 'precise'))) {
        return listMesh
      }
    }
  
    return false
  }
  
  appendCollisionByMeshes(meshes: Array<AbstractMesh>) {
    meshes.forEach(mesh => {
      if (mesh.checkCollisions || Helpers.hasTag(mesh, 'collision')) {
        mesh.checkCollisions = true
        mesh.isVisible = false
        mesh.isPickable = false
        
        this.listCollisions.push(mesh)
      }
    })


    this.scene.getMeshesByTags('invisible').forEach((mesh) => {
      mesh.isVisible = false
    })
  }
}

import { Helpers } from '@/models/Helpers'
import {AbstractMesh, Mesh, NodeMaterial, PBRMaterial} from '@babylonjs/core'

export default class Materials {
  static addCustomMaterial()
  {
    const alphaTags= [
      'material_glass',
    ]

    alphaTags.forEach(tag => {
      const meshes = globalThis.scene.getMeshesByTags(tag.toLowerCase())

      meshes.forEach((mesh: Mesh) => {
        if (tag === 'material_glass') {
          const glassMaterial = new PBRMaterial('glass_material', scene);
          glassMaterial.metallic = 0
          glassMaterial.transparencyMode = PBRMaterial.MATERIAL_ALPHABLEND
          glassMaterial.alpha = 0.1
          glassMaterial.roughness = 0.01
          glassMaterial.subSurface.isRefractionEnabled = true
          mesh.material = glassMaterial
        }
      })
    })
  }

  static async addMaterial (meshes: Array<AbstractMesh>): Promise<null> {
    const materials = []

    for (const mesh of meshes) {
      const tags = Helpers.getTagsFromMesh(mesh)

      if (!tags || !tags.find((tag: string) => tag === 'materials')) {
        continue
      }

      const tagMaterial = tags.find((tag: string) => tag.indexOf('customMaterial') !== -1)

      const materialName = tagMaterial.split('_')[1]

      let nodeMaterial = materials.find(materialItem => materialItem.name === materialName) as null | NodeMaterial

      if (!nodeMaterial) {
        nodeMaterial = await NodeMaterial.ParseFromFileAsync(materialName,'./resources/graphics/materials/' + materialName + '.json', scene)
        materials.push(nodeMaterial)
      }

       mesh.material?.dispose()
       mesh.material = nodeMaterial

    }

    return null
  }
}
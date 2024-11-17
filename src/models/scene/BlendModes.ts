import { Engine, Mesh } from '@babylonjs/core'
import { isNumber } from 'lodash'

export default class BlendModes {
  static init() {
    const alphaTags: (keyof typeof Engine)[] = [
      'ALPHA_DISABLE',
      'ALPHA_ADD',
      'ALPHA_COMBINE',
      'ALPHA_SUBTRACT',
      'ALPHA_MULTIPLY',
      'ALPHA_MAXIMIZED',
      'ALPHA_ONEONE',
      'ALPHA_PREMULTIPLIED',
      'ALPHA_PREMULTIPLIED_PORTERDUFF',
      'ALPHA_INTERPOLATE',
      'ALPHA_SCREENMODE'
    ]

    alphaTags.forEach(tag => {
      const meshes = globalThis.scene.getMeshesByTags(tag.toLowerCase())

      meshes.forEach((mesh: Mesh) => {
        if (mesh.material) {
          const type = Engine[tag]

          if (isNumber(type)) {
            mesh.material.alphaMode = type
            mesh.material.transparencyMode = 2
          }
        }
      })
    })
  }
}
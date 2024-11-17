import {
  Mesh,
  Scene,
  Camera,
  Engine,
  Vector3,
  Matrix,
  AbstractMesh,
  MeshBuilder, StandardMaterial, Color3, Tags,
} from '@babylonjs/core'
import axios from 'axios'

export const Helpers = {
  getRandomInt (min: number, max: number) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  },

  get2DCoordinatesFromMesh (mesh: Mesh, camera: Camera, scene: Scene, engine: Engine) {
    const pos = Vector3.Project(
      mesh.getAbsolutePosition(),
      Matrix.IdentityReadOnly,
      scene.getTransformMatrix(),
      camera.viewport.toGlobal(
        engine.getRenderWidth(),
        engine.getRenderHeight(),
      ),
    )

    return {
      top: pos.y,
      left: pos.x
    }
  },

  getIsSuffix (mesh: AbstractMesh, suffix: string) {
    const nameArray = mesh.id.split('_')

    if (nameArray.length) {
      if (nameArray.find(item => item === suffix)) {
        return true
      }
    }

    return false
  },

  IsName (text: string, find: string, partly = false) {
    if (text === find) {
      return true
    }

    if (partly) {
      return text.search(find) !== -1
    }

    return false
  },

  getMeshesByName (name: string, partly = false) {
    return globalThis.scene.meshes.filter(mesh => Helpers.IsName(mesh.name, name, partly)) as Array<Mesh>
  },

  getMeshByName (scene: Scene, name: string, partly = false) {
    return scene.meshes.find(mesh => Helpers.IsName(mesh.name, name, partly)) as Mesh
  },

  getTime () {
    const date = new Date()
    return date.getTime()
  },

  numberFixed (number: string | number, length = 10): number {
    return Number(Number(number).toFixed(length))
  },

  getNameId (meshId: string) {
    return meshId.split('.')[1]
  },
  drawEllipsoid (mesh: AbstractMesh) {
    const colliderMesh = MeshBuilder.CreateSphere("colliderMesh", { segments: 16, diameterX: mesh.ellipsoid.x * 2, diameterY: mesh.ellipsoid.y * 2, diameterZ: mesh.ellipsoid.z * 2 }, scene);
    colliderMesh.parent = mesh;
    colliderMesh.isVisible = true
    colliderMesh.isPickable = false
    colliderMesh.position.copyFrom(mesh.ellipsoidOffset);
    const material = new StandardMaterial("colliderMaterial", scene);
    material.diffuseColor = new Color3(1, 0, 0); // Цвет коллайдера
    colliderMesh.material = material;

  },
  isFile(url: string) {
    if (url) {
      const split = url.split('/')
      if (split) {
        const pop = split.pop()
        if (pop) {
          return pop.indexOf('.') > 0
        }
      }
    }
    
    return false
  },
  async getFileTimestamp(filePath: string)
  {
    const arr = filePath.split("/") // [ "", "game", "resources", "graphics", "level_1", "map.babylon" ]
    const filePathLastFolder = arr[arr.length - 2] + "/" + arr[arr.length - 1] // "level_1/map.babylon"
    
    try {
      const response = await axios.get(process.env.VUE_APP_RESOURCES_PATH + 'graphics/manifest.json')
      const manifest = response.data
      return manifest[filePathLastFolder] ?? new Date().getTime()
    } catch (error) {
      console.info('manifest.json:', error)
      return new Date().getTime()
    }
  },
  getTagsFromMesh(mesh: any) {
    const rawTags = Tags.GetTags(mesh)
    if (!rawTags || !rawTags.length) {
      return null
    }
  
    return rawTags.split(' ')
  },
  hasTag(mesh: any, tag: string) {
    const tags = this.getTagsFromMesh(mesh)
    if (tags) {
      return tags.find((tagCheck: string) => tagCheck === tag) !== undefined
    }
    
    return false
  },
  generateRandomToken(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }

    const time = this.getTime()

    return result + time.toString().slice(-1)
  }
}
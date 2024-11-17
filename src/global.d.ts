import {
  CascadedShadowGenerator,
  Scene,
  ShadowGenerator,
} from '@babylonjs/core'
import { Container } from '@/models/scene/ContainerManager'
import Collisions from '@/models/mehanics/Collisions'
import { PrefabItem } from '@/models/scene/Prefabs'

declare module '*.scss' {
  const content: { [className: string]: string }
  export default content
}

declare module '*.gltf'
declare module '*.glb'

declare global {
  var scene: Scene;
  var assetContainers: Array<Container>;
  var prefabs: Array<PrefabItem>;
  var collisions: Collisions;
  var shadowGenerator: ShadowGenerator;
  var average: number;
}
import { IGLTFLoaderExtension } from '@babylonjs/loaders/glTF'
import { GLTFLoader } from '@babylonjs/loaders/glTF/2.0'
import { Tags, TransformNode } from '@babylonjs/core'

class TagsExtension implements IGLTFLoaderExtension {
  public readonly name = 'MyTagsExtension'
  public enabled = true
  
  constructor(private _loader: GLTFLoader) {}
  
  public loadNodeAsync(context: string, node: any, assign: (babylonTransformNode: any) => void): Promise<TransformNode> {
    return this._loader.loadNodeAsync(context, node,  (babylonTransformNode) => {
      if (this._loader.gltf.meshes) {
        const mesh = this._loader.gltf.meshes[node.mesh]
        
        if (mesh && mesh.extras) {
          if (mesh.extras.tags) {
            Tags.AddTagsTo(babylonTransformNode, mesh.extras.tags)
          }
        }
      }

      assign(babylonTransformNode)
    });
  }
  
  public dispose(): void {
    // Add code to dispose any resources used by the extension
  }
}

export default function RegisterTagsExtension () {
  GLTFLoader.RegisterExtension('MyTagsExtension', (loader: GLTFLoader) => {
    return new TagsExtension(loader)
  })
}

import {
  CubeTexture,
  GlowLayer,
  Matrix,
  Tools,
  Scene,
  Color3,
  DirectionalLight,
  ShadowGenerator,
  SSAORenderingPipeline, Texture, MeshBuilder, StandardMaterial,
} from '@babylonjs/core'

import storeVuex from "@/store/vuex";
import {Environment as EnvironmentSettings} from "@/store/vuex/types";
import LightPoints from '@/models/scene/LightPoints'
import Sky from '@/models/scene/Sky'

export default class Environment {
  shadowGenerator: ShadowGenerator | null
  scene: Scene
  settings: EnvironmentSettings

  constructor () {
    this.scene = globalThis.scene
    this.shadowGenerator = null
    this.settings = storeVuex.state.settings.environment
  }

  setupHDR () {
    const url = process.env.VUE_APP_RESOURCES_PATH  + 'graphics/textures/environment.env'
    const hdrTexture = CubeTexture.CreateFromPrefilteredData(url, this.scene)
    const hdrRotation = this.settings.hdr.rotation
    
    hdrTexture.setReflectionTextureMatrix(
      Matrix.RotationY(
        Tools.ToRadians(hdrRotation)
      )
    )

    hdrTexture.gammaSpace = this.settings.hdr.gammaSpace
    this.scene.environmentTexture = hdrTexture
    this.scene.environmentIntensity = this.settings.hdr.intensity
  }

  setupGlow () {
    const gl = new GlowLayer('glow', this.scene, {
      mainTextureFixedSize: this.settings.glow.mainTextureFixedSize,
      blurKernelSize: this.settings.glow.blurKernelSize
    })
    
    gl.intensity = this.settings.glow.intensity
  }
  
  setupFog () {
    this.scene.fogColor = new Color3(this.settings.fog.color.r, this.settings.fog.color.g, this.settings.fog.color.b)
    this.scene.fogDensity = this.settings.fog.density
    this.scene.fogMode =  this.settings.fog.mode
  }
  
  setupLightAndShadow () {
    const light = this.scene.getLightById('MainDirectionLight') as DirectionalLight
    light.intensity = this.settings.directionalLight.intensity
    light.shadowEnabled = true
    
    if (!light) {
      console.info('Add a light with the ID MainDirectionLight to display the shadow')
      return
    }

    const shadowGenerator = new ShadowGenerator(5000, light);

    globalThis.scene.getMeshesByTags('cast_shadows').forEach((mesh) => {
        shadowGenerator.addShadowCaster(mesh)
    })


    shadowGenerator.useExponentialShadowMap = true;
    //shadowGenerator.useContactHardeningShadow = true;
    //shadowGenerator.contactHardeningLightSizeUVRatio = 0.0075;
    globalThis.shadowGenerator = shadowGenerator
  }

  setupSSAO () {
    const ssaoRatio = {
      ssaoRatio: 0.5, // Коэффициент разрешения SSAO
      combineRatio: 1.0 // Коэффициент разрешения итогового изображения
    }

    const ssao = new SSAORenderingPipeline("ssao", this.scene, ssaoRatio)
    ssao.fallOff = 0.1;
    ssao.area = 1;
    ssao.radius = 0.0001;
    ssao.totalStrength = 1.0;
    ssao.base = 0.5;

    scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("ssao", this.scene.activeCamera)
  }

  setupLightPoints()
  {
    const lightPoints = new LightPoints()
    lightPoints.setupLights()
  }

  setupSkybox()
  {
    const skybox = MeshBuilder.CreateBox("skyBox", { size: 500 }, scene)
    const skyboxMaterial = new StandardMaterial("skyBoxMaterial", scene)
    skyboxMaterial.backFaceCulling = false
    skyboxMaterial.reflectionTexture = new CubeTexture("./resources/graphics/textures/skybox/skybox", scene)
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE
    skyboxMaterial.disableLighting = true
    skybox.material = skyboxMaterial

    skyboxMaterial.diffuseColor = new Color3(0, 0, 0)
    skyboxMaterial.specularColor = new Color3(0, 0, 0)
  }

  setupSky()
  {
    Sky.init()
  }
}
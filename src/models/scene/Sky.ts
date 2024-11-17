import { ParticleSystem, Texture, Color4 } from '@babylonjs/core'

export default class Sky {
  static init () {
    const scene = globalThis.scene
    const particleSystem = new ParticleSystem("particles", 1000, scene);
    particleSystem.particleTexture = new Texture('/resources/graphics/textures/star.png', scene);

    particleSystem.emitter = scene.getMeshById('Ship')

    particleSystem.color1 = new Color4(0.7, 0.8, 1.0, 1.0);
    particleSystem.color2 = new Color4(0.2, 0.5, 1.0, 1.0);
    particleSystem.colorDead = new Color4(0, 0, 0.2, 0.0);

    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.9;

    particleSystem.minLifeTime = 1000;
    particleSystem.maxLifeTime = 10000;

    particleSystem.emitRate = 100;
    particleSystem.preWarmStepOffset = 100;
    particleSystem.preWarmCycles = 1000;

    const sphereEmitter= particleSystem.createSphereEmitter(100);
    sphereEmitter.radiusRange = 0;

    particleSystem.minEmitPower = 0;
    particleSystem.maxEmitPower = 0;
    particleSystem.updateSpeed = 0.005;

    particleSystem.start();
  }
}
export interface Level {
  id: number
  finish: boolean
  name: string
}

export interface Environment {
  "hdr": {
    "rotation": number,
    "intensity": number,
    "gammaSpace": boolean
  },
  "glow": {
    "mainTextureFixedSize": number,
    "blurKernelSize": number,
    "intensity": number
  },
  "fog": {
    "color": {
      "r": number,
      "g": number,
      "b": number
    },
    "density": number,
    "mode": number
  },
  "directionalLight": {
    "intensity": number
  },
  "shadowGenerator": {
    "mapSize": number,
    "usePercentageCloserFiltering": boolean,
    "numCascades": number,
    "autoCalcDepthBounds": boolean,
    "depthClamp": boolean,
    "stabilizeCascades": boolean,
    "cascadeBlendPercentage": number,
    "bias": number,
    "filteringQuality": number
  }
}

export interface RootState {
  currentPage: string
  isMobile: string | null
  levelId: number
  password: string | null
  levels: Array<Level>
  settings: {
    environment: Environment
  }
}
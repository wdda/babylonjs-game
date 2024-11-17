export interface lowerFloorPosition {
  x: number,
  y: number,
  z: number,
}

export interface lowerFloorSize {
  width: number,
  height: number,
}


export interface LevelState {
  levelId: number,
  loading: boolean,
  play: boolean,
  isMapOpen: boolean,
  isMenuOpen: boolean,
  lowerFloorPosition: lowerFloorPosition,
  lowerFloorSize: lowerFloorSize,
  finish: boolean,
  savepointId: string | null
}

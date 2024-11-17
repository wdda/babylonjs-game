import {Color3} from "@babylonjs/core";

export interface Forward {
  left: boolean;
  right: boolean;
  front: boolean;
  back: boolean;
  isMoving: boolean;
  sprint: boolean;
}

export interface SyncData {
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number }
  characterAngle: number
}

export interface Move {
  forward: Forward;
  jump: boolean;
  isFlying: boolean;
  isFlyingEnd: boolean;
  jumpStart: boolean;
  jumpRunning: boolean;
  rotate: { x: number; y: number };
  syncData: SyncData
  speed: number,
  speedType: string,
  speedGravity: number
}

export interface Player {
  id: string
  move: Move
  character: string
  skinColor: Color3,
  points: number
}
export interface State {
  selfPlayerId: string | undefined
  selfPlayer: Player | undefined
  players: Array<Player>
  settings: Settings
}

export interface Settings {
  gravityMin: number
  gravityMax: number
  speed: number
  speedSprint: number
  speedDeltaTimeDivider: number
  jumpHeight: number
  jumpHeightSprint: number
  acceleration: number
  accelerationGravity: number
  transitionAnimationSpeed: number
}


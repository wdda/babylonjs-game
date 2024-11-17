import { AnimationGroup } from '@babylonjs/core'

export interface AnimationGroupInterface {
  playerId: string;
  animation: AnimationGroup | null;
  weight: number;
  autoPlayLoop: boolean;
  intervalId: null | number
  name: string
}

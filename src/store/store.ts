import { State, Player, Forward, SyncData } from './types'
import { isEqual } from 'lodash'
import {Color3} from "@babylonjs/core";

const playerExample: Player = {
  id: 'new',
  character: '',
  skinColor: Color3.Random(),
  points: 0,
  move: {
    forward: {
      front: false,
      back: false,
      left: false,
      right: false,
      isMoving: false,
      sprint: false
    },
    rotate: { x: 0, y: 0 },
    jump: false,
    isFlying: true,
    isFlyingEnd: false,
    jumpStart: false,
    jumpRunning: false,
    speed: 0,
    speedType: 'Idle',
    speedGravity: 0,
    syncData: {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0 },
      characterAngle: 0
    },
  }
}

export class Store {
  private state: State
  private subscribers: { [key: string]: any[] } = {}
  private addPlayerSubscribers: any[] = []
  constructor () {
    this.state = {
      selfPlayerId: undefined,
      selfPlayer: undefined,
      players: [],
      settings: {
        speed: 0.06,
        speedSprint: 0.09,
        speedDeltaTimeDivider: 500,
        acceleration: 0.004,
        gravityMin: 0.009,
        gravityMax: 0.8,
        accelerationGravity: 0.014,
        jumpHeight: 3.3,
        jumpHeightSprint: 4.2,
        transitionAnimationSpeed: 0.08
      }
    }
  }

  addPlayer (playerId: string, skinColor: Color3) {
    const playerCheck = this.state.players.find(player => player.id === playerId)
    
    if (playerCheck === undefined) {
      const newPlayer = JSON.parse(JSON.stringify(playerExample))
      newPlayer.id = playerId
      newPlayer.character = 'Girl.glb'
      newPlayer.skinColor = skinColor

      this.state.players.push(newPlayer)
      
      if (playerId === this.getSelfPlayerId()) {
        this.state.selfPlayer = newPlayer
      }
      
      this.notifySubscribers(playerId, 'addPlayer', newPlayer)
      this.notifyAddPlayerSubscribers(playerId, newPlayer)
    }
  }
  
  getPlayer(playerId: string) {
    const player =  this.state.players.find(player => player.id === playerId)
    
    if (player === undefined) {
      throw 'Player not found'
    }
    
    return player
  }
  
  getListPlayers() {
    return this.state.players
  }
  
  getSelfPlayer() {
    if (this.state.selfPlayer === undefined) {
      throw 'Player not set'
    }
    
    return this.state.selfPlayer
  }
  
  getSelfPlayerId() {
      if (this.state.selfPlayerId === undefined) {
        throw 'PlayerID not set'
      }
      
      return this.state.selfPlayerId
  }
  
  addPoint(playerId: string, count: number) {
    const player = this.getPlayer(playerId)
    player.points += count

    this.notifySubscribers(playerId, 'points', player.points)
    this.setSprint(playerId, true)
  }

  getCountPoint(playerId: string) {
    const player = this.getPlayer(playerId)
    return player.points
  }

  removePoint(playerId: string, count: number) {
    const player = this.getPlayer(playerId)
    player.points -= count

    this.notifySubscribers(playerId, 'points', player.points)

    if (player.points <= 0) {
      this.setSprint(playerId, false)
    }
  }
  
  setPlayerId (playerId: string) {
    this.state.selfPlayerId = playerId
  }
  
  setForward (playerId: string, forward: Forward) {
    forward.isMoving = !(
      !forward.left &&
      !forward.right &&
      !forward.back &&
      !forward.front
    )
    
    const player = this.getPlayer(playerId)
    const oldForward = player.move.forward
    const equal = isEqual(oldForward, forward)
    
    if (!equal) {
      player.move.forward = { ...forward }
      this.notifySubscribers(playerId, 'forward', player.move.forward)
    }
  }
  
  setRotate (playerId: string, x: number, y: number) {
    const player = this.getPlayer(playerId)
    
    if (player.move.rotate.x !== x || player.move.rotate.y !== y) {
      player.move.rotate.x = x
      player.move.rotate.y = y
      
      this.notifySubscribers(playerId, 'rotate', player.move.rotate)
    }
  }
  
  setJump(playerId: string, jump: boolean) {
    const player = this.getPlayer(playerId)
    
    if (player.move.jump !== jump) {
      player.move.jump = jump
      this.notifySubscribers(playerId, 'jump', jump)
    }
  }

  setJumpStart(playerId: string) {
    const player = this.getPlayer(playerId)
    player.move.jumpStart = true

    this.notifySubscribers(playerId, 'jumpStart', true)

    setTimeout(() => {
      player.move.jumpStart = false
      this.notifySubscribers(playerId, 'jumpStart', false)
    }, 200)
  }

  setJumpRunning(playerId: string, isRun: boolean) {
    const player = this.getPlayer(playerId)
    player.move.jumpRunning = isRun
  }
  
  setIsFlying(playerId: string, isFlying: boolean) {
    const player = this.getPlayer(playerId)
    
    if (player.move.isFlying !== isFlying) {
      player.move.isFlying = isFlying
      
      this.notifySubscribers(playerId, 'isFlying', isFlying)
    }
  }
  
  setSpeedType(playerId: string, type: string) {
    const player = this.getPlayer(playerId)
    
    if (player.move.speedType !== type) {
      player.move.speedType = type
      this.notifySubscribers(playerId, 'speedType', type)
    }
  }

  setSpeed(playerId: string, speed: number) {
    const player = this.getPlayer(playerId)

    if (player.move.speed !== speed) {
      player.move.speed = speed
      this.notifySubscribers(playerId, 'speed', speed)
    }
  }

  setSprint(playerId: string, sprint: boolean) {
    const player = this.getPlayer(playerId)
    const oldSprint = player.move.forward.sprint
    const equal = oldSprint === sprint

    if (!equal) {
      player.move.forward.sprint = sprint
      this.notifySubscribers(playerId, 'forward', player.move.forward)
    }
  }

  setSpeedGravity(playerId: string, speed: number) {
    const player = this.getPlayer(playerId)

    if (player.move.speedGravity !== speed) {
      player.move.speedGravity = speed
      this.notifySubscribers(playerId, 'speed', speed)
    }
  }
  
  setSyncData(playerId: string, data: SyncData) {
    const player = this.getPlayer(playerId)
    const equal = isEqual(player.move.syncData, data)
    
    if (!equal) {
      player.move.syncData = data
      this.notifySubscribers(playerId, 'syncData', data)
    }
  }
  
  getSettings() {
    return this.state.settings
  }
  
  subscribe(playerId: string, callback: any) {
    if (!this.subscribers[playerId]) {
      this.subscribers[playerId] = []
    }
    
    this.subscribers[playerId].push(callback)
  }
  
  private notifySubscribers(playerId: string, type: string, data: any = null) {
    if (this.subscribers[playerId]) {
      for (const callback of this.subscribers[playerId]) {
        callback(type, data)
      }
    }
  }
  
  subscribeAddPlayer(callback: any) {
    this.addPlayerSubscribers.push(callback)
  }
  
  private notifyAddPlayerSubscribers(playerId: string, player: Player) {
    for (const callback of this.addPlayerSubscribers) {
      callback(playerId, player)
    }
  }
}

export default new Store()
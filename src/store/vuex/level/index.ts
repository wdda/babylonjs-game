import { Module } from 'vuex'
import { RootState } from '@/store/vuex/types'
import { LevelState } from '@/store/vuex/level/types'
import { mutations } from '@/store/vuex/level/mutations'

const state: LevelState = {
  levelId: 0,
  play: false,
  loading: true,
  isMapOpen: false,
  isMenuOpen: false,
  lowerFloorPosition: {x: 0, y: 0, z: 0},
  lowerFloorSize: {width: 0, height: 0},
  finish: false,
  savepointId: null
}

const getters = {
  finish: (state: LevelState) => state.finish
}

export const level: Module<LevelState, RootState> = {
  state,
  mutations,
  getters
}
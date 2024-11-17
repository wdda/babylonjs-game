import { MutationTree } from 'vuex'
import { LevelState } from '@/store/vuex/level/types'
import { Level as LevelStorage } from '@/models/storage/Level'

export const mutations: MutationTree<LevelState> = {
  SET_PLAY (state) {
    state.play = true
  },
  SET_OPEN_MENU (state, payload) {
    state.isMenuOpen = payload
  },
  MAP_TOGGLE (state) {
    state.isMapOpen = !state.isMapOpen
  },
  LOADING_TOGGLE (state) {
    state.loading = !state.loading
  },
  SET_LOWER_FLOOR_POSITION (state, payload) {
    state.lowerFloorPosition.x = payload.x
    state.lowerFloorPosition.y = payload.y
    state.lowerFloorPosition.z = payload.z
  },
  SET_LOWER_FLOOR_SIZE (state, payload) {
    state.lowerFloorSize.width = payload.width
    state.lowerFloorSize.height = payload.height
  },
  SET_FINISH (state) {
    LevelStorage.saveCompletedLevel(state.levelId)
    state.finish = true
  },
  SET_SAVEPOINT (state, id) {
    state.savepointId = id
  },
  SET_BACK_TO_SAVEPOINT () {
    console.log('Back!')
  }
}
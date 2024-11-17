import Vuex, { StoreOptions } from 'vuex'
import {Level, RootState} from '@/store/vuex/types'
import { settingsLevel } from '@/store/vuex/settingsLevel'
import { level } from '@/store/vuex/level'
import MobileDetect from 'mobile-detect'

const store: StoreOptions<RootState> = {
  strict: false,
  state: {
    currentPage: 'MainPage',
    isMobile: new MobileDetect(window.navigator.userAgent).mobile(),
    levelId: 1,
    password: null,
    levels: [],
    settings: {
      environment: {
        hdr: {
          rotation: 0,
          intensity: 1,
          gammaSpace: false
        },
        glow: {
          mainTextureFixedSize: 1054,
          blurKernelSize: 70,
          intensity: 0.4
        },
        fog: {
          color: {
            r: 0.208,
            g: 0.337,
            b: 0.510
          },
          density: 0.01,
          mode: 1
        },
        directionalLight: {
          intensity: 1
        },
        shadowGenerator: {
          mapSize: 2064,
          usePercentageCloserFiltering: true,
          numCascades: 4,
          autoCalcDepthBounds: false,
          depthClamp: true,
          stabilizeCascades: false,
          cascadeBlendPercentage: 0,
          bias: 0.001,
          filteringQuality: 0
        }
      }
    }
  },
  mutations: {
    SET_PAGE (state, payload) {
      state.currentPage = payload
    },
    SET_LEVEL (state, levelId) {
      state.levelId = levelId
    },
    SET_LEVELS (state, levels) {
      state.levels = []

      levels.forEach((level: Level) => {
        level.finish = false
        state.levels.push(level)
      })
    },
    SET_PASSWORD (state, password) {
      state.password = password
    },
    SET_ENVIRONMENT(state, environment) {
      state.settings.environment = environment
    }
  },
  modules: {
    level,
    settingsLevel
  },
}

export default new Vuex.Store<RootState>(store)
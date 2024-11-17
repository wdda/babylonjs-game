import { MutationTree } from 'vuex'
import { SettingsLevel } from '@/store/vuex/settingsLevel/types'
import { Settings as SettingsStorage } from '@/models/storage/Settings'

export const mutations: MutationTree<SettingsLevel> = {
  SET_SETTINGS_OPEN (state, payload) {
    state.open = payload
  },
  SET_SETTING_FIELD_VALUE (state, payload) {
    if (SettingsStorage.validateFieldName(payload.name)) {
      SettingsStorage.setValueByName(payload.name, payload.value)
      state.fields.forEach((field) => {
        if (field.name === payload.name) {
          field.value = payload.value
        }
      })
    }
  }
}
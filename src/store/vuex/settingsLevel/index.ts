import { Module } from 'vuex'
import { RootState } from '@/store/vuex/types'
import { mutations } from '@/store/vuex/settingsLevel/mutations'
import { SettingsLevel } from '@/store/vuex/settingsLevel/types'
import { Field, Settings as SettingsLocalStorage } from '@/models/storage/Settings'


const state: SettingsLevel = {
  fields: SettingsLocalStorage.getFields(),
  open: false
}

const getters = {
  settingFields: (state: SettingsLevel) => state.fields,
  getSettingsFieldByName: (state: SettingsLevel) => (name: string) => {
    return state.fields.find(field => field.name == name)
  },
  getSettingsValueByName: (state: SettingsLevel) => (name: string) => {
    const field = state.fields.find((field: Field) => field.name == name)

    if (!field) {
      throw 'Error setting field in Store state'
    }

    return field.value
  }
}

export const settingsLevel: Module<SettingsLevel, RootState> = {
  state,
  mutations,
  getters
}

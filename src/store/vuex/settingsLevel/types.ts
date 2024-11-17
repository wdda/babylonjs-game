import { Field } from '@/models/storage/Settings'

export interface SettingsLevel {
  fields: Array<Field>,
  open: boolean
}

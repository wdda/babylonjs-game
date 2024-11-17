export interface Field {
  name: string;
  value: any;
  label: string;
}

export const Settings = {
  fields: [
    {
      name: 'music',
      value: true,
      label: 'Music'
    },
    {
      name: 'sound',
      value: true,
      label: 'Sound'
    },
    {
      name: 'dev_mode',
      value: false,
      label: 'Dev mode'
    },
    {
      name: 'show_fps',
      value: false,
      label: 'Show fps'
    }
  ],
  validateFieldName(name: string) {
    const field = this.fields.find((field: Field) => field.name == name)

    if (!field) {
      throw 'Error setting field'
    }

    return true
  },
  setValueByName (name: string, value: any) {
    this.validateFieldName(name)
    const fields = this.getFields()

    const settings = fields.map((field: Field) => {
      if (field.name == name) {
        field.value = value
      }

      return field
    })

    localStorage.setItem('settings', JSON.stringify(settings))

    return true
  },
  getValueByName (name: string) {
    const fields = this.getFields()
    const field = fields.find((field: Field) => field.name == name)

    if (!field) {
      throw 'Error setting field'
    }

    return field.value
  },
  getFields () {
    const settingsStorage = localStorage.getItem('settings')
    if (settingsStorage) {
      const settings = JSON.parse(String(settingsStorage))
      return this.fields.map(field => {
        const oldField = settings.find((settingField: any) => settingField.name == field.name)
        if (oldField) {
          field.value = oldField.value
        }

        return field
      })
    }

    return this.fields
  }
}
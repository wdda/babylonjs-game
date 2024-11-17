import { Settings } from '@/models/storage/Settings'
import { Inspector } from '@babylonjs/inspector'
import '@babylonjs/node-editor'


export default class DevMode {
  constructor () {
    if (Settings.getValueByName('dev_mode')) {
      this.enabled()
    }
  }
  
  enabled () {
    const globalRoot = document.getElementsByTagName('body')[0]
    if (globalRoot) {
      Inspector.Show(scene, {overlay: true, globalRoot: globalRoot})
    }
  }
}
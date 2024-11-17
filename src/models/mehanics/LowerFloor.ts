import store from '@/store/vuex'

export default class LowerFloor {
  constructor () {
    const lowerFloor = scene.getMeshById('FOR_MINIMAP')
    if (lowerFloor) {
      lowerFloor.isVisible = false
      const position = lowerFloor.getAbsolutePosition()

      store.commit('SET_LOWER_FLOOR_POSITION', {
        x: position.x,
        y: position.y,
        z: position.z,
      })

      const bound = lowerFloor.getBoundingInfo().boundingBox

      store.commit('SET_LOWER_FLOOR_SIZE', {
        width: Math.abs(bound.minimumWorld.x - bound.maximumWorld.x),
        height: Math.abs(bound.minimumWorld.z - bound.maximumWorld.z)
      })
    }
  }
}
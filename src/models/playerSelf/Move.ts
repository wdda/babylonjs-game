import MoveCommon from '../сommon/Move'
import store from '@/store/store'

export default class Move extends MoveCommon {
  static instance: Move
  constructor () {
    super(store.getSelfPlayerId())
  }
}

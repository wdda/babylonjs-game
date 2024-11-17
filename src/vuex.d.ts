import { Store } from 'vuex'

declare module '@vue/runtime-core' {

  import { RootState } from '@/store/vuex/types'

  interface ComponentCustomProperties {
    $store: Store<RootState>
  }
}
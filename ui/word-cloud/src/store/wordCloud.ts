// import { ref } from 'vue'
// import { createGlobalState } from '@vueuse/core'

import type { CreateGlobalStateReturn } from '@vueuse/core'
import type { Ref } from 'vue'

export const useGlobalState: CreateGlobalStateReturn<{
  ratio: Ref<number>
  maskCanvas: Ref<HTMLCanvasElement | undefined>
  run: Ref<boolean>
}> = createGlobalState(
  () => {
    // state
    const ratio = ref(1)
    const maskCanvas = ref<HTMLCanvasElement>()
    const run = ref(false)

    return { ratio, maskCanvas, run }
  },
)

<script setup lang="ts">
import type { BlockItem, BlockPluginSettings } from '@poto/types'
import type { PropType } from 'vue'
import type { Settings } from '~/constants'

const props = defineProps({
  item: {
    type: Object as PropType<BlockItem>,
    required: true,
  },
  realContent: {
    type: Boolean,
    default: true,
  },
  isPreview: {
    type: Boolean,
    required: false,
  },
})

const matchSettings = computed(() => {
  return (props.item.options as BlockPluginSettings).matchSettings as Settings
})
const designer = useDesignerStore()
const ratio = 16 / 10
const src = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB2aWV3Qm94PSIwIDAgNzIwIDExNTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8cmVjdCB3aWR0aD0iNzIwIiBoZWlnaHQ9IjExNTIiIGZpbGw9IiMwMDgwMDAiLz4KIDxnIHN0cm9rZT0iI2JiYiI+CiAgPGcgZmlsbD0iIzU5YjIwMCIgc3Ryb2tlLXdpZHRoPSIwIj4KICAgPHJlY3QgeT0iNjE2IiB4PSIwIiBoZWlnaHQ9Ijc4IiB3aWR0aD0iNzIwIi8+CiAgIDxyZWN0IHk9IjQ1NiIgeD0iMCIgaGVpZ2h0PSI3OCIgd2lkdGg9IjcyMCIvPgogICA8cmVjdCB5PSIzMDEiIHg9IjAiIGhlaWdodD0iNzgiIHdpZHRoPSI3MjAiLz4KICAgPHJlY3QgeT0iMCIgeD0iMCIgaGVpZ2h0PSI3OCIgd2lkdGg9IjcyMCIvPgogICA8cmVjdCB5PSIxMDc1IiB4PSIwIiBoZWlnaHQ9Ijc4IiB3aWR0aD0iNzIwIi8+CiAgIDxyZWN0IHk9IjE0NSIgeD0iMCIgaGVpZ2h0PSI3OCIgd2lkdGg9IjcyMCIvPgogICA8cmVjdCB5PSI5MjciIHg9IjAiIGhlaWdodD0iNzgiIHdpZHRoPSI3MjAiLz4KICAgPHJlY3QgeT0iNzY2IiB4PSIwIiBoZWlnaHQ9Ijc4IiB3aWR0aD0iNzIwIi8+CiAgPC9nPgogIDxjaXJjbGUgY3k9IjU3NSIgY3g9IjM2MCIgcj0iOTEuNSIgZmlsbC1vcGFjaXR5PSIwIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8Y2lyY2xlIGN5PSI1NzUiIGN4PSIzNjAiIHI9IjIiIGZpbGw9IiNiYmIiLz4KICA8Y2lyY2xlIGN5PSIxNjAiIGN4PSIzNjAiIHI9IjIiIGZpbGw9IiNiYmIiLz4KICA8Y2lyY2xlIGN5PSI5OTAiIGN4PSIzNjAiIHI9IjIiIGZpbGw9IiNiYmIiLz4KICA8ZyBzdHJva2Utd2lkdGg9IjIiPgogICA8ZyBmaWxsLW9wYWNpdHk9IjAiPgogICAgPHBhdGggZD0ibTMyMCA1MCB2IC0xMCBoIDgwIHYgMTAiLz4KICAgIDxwYXRoIGQ9Im0zMjAgMTEwMCB2IDEwIGggODAgdiAtMTAiLz4KICAgIDxwYXRoIGQ9Im0yNjkuNCA1MCB2IDU1IGggMTgyLjIgdiAtNTUiLz4KICAgIDxwYXRoIGQ9Im0yNjkuNCAxMTAwIHYgLTU1IGggMTgyLjIgdiA1NSIvPgogICAgPHBhdGggZD0ibTE2MC40IDUwIHYgMTY1IGggNDAyLjIgdiAtMTY1Ii8+CiAgICA8cGF0aCBkPSJtMTYwLjQgMTEwMCB2IC0xNjUgaCA0MDIuMiB2IDE2NSIvPgogICA8L2c+CiAgIDxnIGZpbGw9Im5vbmUiPgogICAgPHBhdGggZD0ibTI4Ni44OCAyMTUgYTkxLjUgOTEuNSAwIDAgMCAxNDYuMjUgMCAiLz4KICAgIDxwYXRoIGQ9Im0yODYuODggOTM1IGE5MS41IDkxLjUgMCAwIDEgMTQ2LjI1IDAgIi8+CiAgIDwvZz4KICAgPGcgZmlsbC1vcGFjaXR5PSIwIj4KICAgIDxwYXRoIGQ9Im02OTAgNTAgYTEwIDEwIDAgMCAwIDEwIDEwIi8+CiAgICA8cGF0aCBkPSJtMzAgNTAgYTEwIDEwIDAgMCAxIC0xMCAxMCIvPgogICAgPHBhdGggZD0ibTY5MCAxMTAwIGExMCAxMCAwIDAgMSAxMCAtMTAiLz4KICAgIDxwYXRoIGQ9Im0zMCAxMTAwIGExMCAxMCAwIDAgMCAtMTAgLTEwIi8+CiAgIDwvZz4KICA8L2c+CiAgPGcgc3Ryb2tlLXdpZHRoPSIyIj4KICAgPGcgZmlsbD0ibm9uZSI+CiAgICA8bGluZSB5MT0iNTAiIHkyPSIxMTAwIiB4MT0iMjAiIHgyPSIyMCIvPgogICAgPGxpbmUgeTE9IjUwIiB5Mj0iNTAiIHgxPSIyMCIgeDI9IjcwMCIvPgogICAgPGxpbmUgeTE9IjUwIiB5Mj0iMTEwMCIgeDE9IjcwMCIgeDI9IjcwMCIvPgogICAgPGxpbmUgeTE9IjExMDAiIHkyPSIxMTAwIiB4MT0iMjAiIHgyPSI3MDAiLz4KICAgIDxsaW5lIHkxPSI1NzUiIHkyPSI1NzUiIHgxPSIyMCIgeDI9IjcwMCIvPgogICA8L2c+CiAgPC9nPgogPC9nPgo8L3N2Zz4K'
const height = computed(() => {
  return (750 - designer.options.padding[1] - designer.options.padding[3]) * ratio
})

const lineupR = computed(() => {
  return [1].concat((matchSettings.value.teamRed.formation.split('-')).map(i => parseInt(i)))
})
const lineupB = computed(() => {
  return ([1].concat((matchSettings.value.teamBlue.formation.split('-')).map(i => parseInt(i)))).reverse()
})
</script>

<template>
  <div v-if="realContent">
    <div class="flex justify-between bg-dark-400 p-2">
      <div class="flex items-center">
        <img
          :src="matchSettings.teamRed.logo"
          style="width: 100px; height: 100px"
        >
        <div class="flex flex-col justify-between ml-3">
          <div class="text-red-500 text-3xl">
            {{ matchSettings.teamRed.name }}
          </div>
          <div class="text-light-500 text-base">
            {{ matchSettings.teamRed.coach.name }}
          </div>
          <div class="text-light-500 text-base">
            {{ matchSettings.teamRed.formation }}
          </div>
        </div>
      </div>
      <div class="flex items-center">
        <div class="flex flex-col justify-between items-end mr-3">
          <div class="text-sky-500 text-3xl">
            {{ matchSettings.teamBlue.name }}
          </div>
          <div class="text-light-500 text-base">
            {{ matchSettings.teamBlue.coach.name }}
          </div>
          <div class="text-light-500 text-base">
            {{ matchSettings.teamBlue.formation }}
          </div>
        </div>
        <img
          :src="matchSettings.teamBlue.logo"
          style="width: 100px; height: 100px"
        >
      </div>
    </div>
    <div class="flex flex-col text-light-50 text-xl" :style="{ height: `${height}px`, background: `url(${src}) no-repeat center center / contain` }">
      <div class="w-full basis-1/2 flex flex-col items-center justify-around" :class="lineupR.length > 4 ? 'mt-2' : 'mt-5'">
        <div v-for="n, i in lineupR" :key="n" class="flex flex-row justify-around" :class="n > 4 ? 'w-full' : n > 3 ? 'w-4/5' : n > 2 ? 'w-3/5' : 'w-2/5'">
          <div v-for="m, j in n" :key="m" class="flex flex-col items-center justify-center">
            <div class="w-50px h-50px rounded-1/2 bg-red-500 flex flex-col justify-center items-center">
              <div class="i-codicon-jersey text-44px" />
              <div class="w-44px h-44px flex justify-center items-center" style="margin-top: -44px;">
                <div class="text-16px">
                  {{ matchSettings.teamRed.lineup[i][j].num }}
                </div>
              </div>
            </div>
            <div>{{ matchSettings.teamRed.lineup[i][j].name }}</div>
          </div>
        </div>
      </div>
      <div class="w-full basis-1/2 flex flex-col items-center justify-around" :class="lineupB.length > 4 ? 'mb-2' : 'mb-5'">
        <div v-for="n, i in lineupB" :key="n" class="flex flex-row justify-around" :class="n > 4 ? 'w-full' : n > 3 ? 'w-4/5' : n > 2 ? 'w-3/5' : 'w-2/5'">
          <div v-for="m, j in n" :key="m" class="flex flex-col items-center justify-center">
            <div class="w-50px h-50px rounded-1/2 bg-sky-500 flex flex-col justify-center items-center">
              <div class="i-codicon-jersey text-44px" />
              <div class="w-44px h-44px flex justify-center items-center" style="margin-top: -44px;">
                <div class="text-16px">
                  {{ matchSettings.teamBlue.lineup[i][j].num }}
                </div>
              </div>
            </div>
            <div>{{ matchSettings.teamBlue.lineup[i][j].name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="flex justify-center items-center">
    <div class="i-mdi-soccer-field text-4xl" />
  </div>
</template>

<style scoped>
  /* .test {
    background: url('../assets/soccer.svg')
  } */
</style>

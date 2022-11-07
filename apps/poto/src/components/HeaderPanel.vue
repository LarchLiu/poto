<script setup lang="ts">
import type { PotoTemplate } from '~/types'
const designer = useDesignerStore()
const customBlocks = useCustomBlocksStore()
const { t, locale } = useI18n()

const toggleLocales = (command: string) => {
  locale.value = command
}

const recordTemplateStop = () => {
  designer.recordStop()
}

const saveJsonFile = (data: string) => {
  const blob = new Blob([data], { type: 'text/plain' })
  const a = document.createElement('a')
  a.download = 'template.json'
  a.href = window.URL.createObjectURL(blob)
  a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
  a.click()
}

const saveTemplate = () => {
  designer.replayReset()
  const template: PotoTemplate = {
    potoActions: [],
    potoCustomBlocks: customBlocks.components,
    potoDesigner: {
      id: designer.id,
      actions: designer.actions || [],
      list: designer.list || [],
      options: designer.options,
      theme: designer.theme,
      listRecords: designer.listRecords,
      optionsRecords: designer.optionsRecords,
      themeRecords: designer.themeRecords,
      currentItemIdRecords: designer.currentItemIdRecords,
    },
  }
  saveJsonFile(JSON.stringify(template))
}

onUnmounted(() => {
  if (designer.getReplayStatus() !== 'stop')
    designer.replayStop()
})
</script>

<template>
  <div>
    <span class="text-20px mx-6px font-bold text-#242424">Poto</span>
  </div>
  <div>
    <div v-if="designer.getRecordStatus() !== 'stop'" flex items-center>
      <button
        v-if="designer.getRecordStatus() === 'recording'"
        type="button" :title="t('common.pause')"
        @click="designer.recordPause()"
      >
        <div i-material-symbols-pause-circle-outline class="text-2xl ml-1" />
      </button>
      <button
        v-else-if="designer.getRecordStatus() === 'pause'"
        type="button" :title="t('common.resume')"
        @click="designer.recordResume()"
      >
        <div i-material-symbols-play-circle-outline class="text-2xl ml-1" />
      </button>
      <button
        type="button" :title="t('common.stop')"
        @click="recordTemplateStop"
      >
        <div i-material-symbols-stop-circle-outline class="text-2xl ml-1" />
      </button>
    </div>
    <div v-else-if="designer.listRecords" flex items-center>
      <button type="button" :title="t('common.downloadTemplate')" @click="saveTemplate()">
        <div i-material-symbols-download class="text-2xl ml-1" />
      </button>
      <button
        type="button"
        :title="t('common.preStep')"
        :class="designer.canReplayRedo ? '' : 'opacity-50'"
        @click="designer.canReplayRedo ? designer.replayRedo() : {}"
      >
        <div i-radix-icons-double-arrow-left class="text-xl ml-2" />
      </button>
      <button
        v-if="designer.getReplayStatus() === 'replaying'"
        type="button" :title="t('common.pause')"
        @click="designer.replayPause()"
      >
        <div i-radix-icons-pause class="text-2xl ml-2" />
      </button>
      <button
        v-else-if="designer.getReplayStatus() === 'pause'"
        type="button" :title="t('common.resume')"
        @click="designer.replayResume()"
      >
        <div i-radix-icons-resume class="text-2xl ml-2" />
      </button>
      <button
        v-if="designer.getReplayStatus() === 'stop'"
        type="button" :title="t('common.replayTemplate')"
        @click="designer.recordReplay()"
      >
        <div i-radix-icons-play class="text-2xl ml-2" />
      </button>
      <button
        type="button" :title="t('common.stop')"
        :class="designer.getReplayStatus() === 'stop' ? 'opacity-50' : 'opacity-100'"
        @click="designer.getReplayStatus() === 'stop' ? {} : designer.replayReset()"
      >
        <div i-radix-icons-stop class="text-xl ml-2" />
      </button>
      <button
        type="button"
        :title="t('common.nextStep')"
        :class="designer.canReplayUndo ? '' : 'opacity-50'"
        @click="designer.canReplayUndo ? designer.replayUndo() : {}"
      >
        <div i-radix-icons-double-arrow-right class="text-xl ml-2" />
      </button>
      <div class="flex items-center relative group">
        <button
          type="button"
          :title="t('common.replaySpeed')"
        >
          <div i-mdi-play-speed class="text-2xl ml-2" />
        </button>
        <div class="absolute left-8 pl-2 w-50 invisible opacity-0 group-hover:visible group-hover:opacity-100">
          <el-slider v-model="designer.replayDuration" show-stops :min="500" :max="5000" :step="500" />
        </div>
      </div>
    </div>
  </div>
  <div flex items-center>
    <el-dropdown @command="toggleLocales">
      <button type="button" :title="t('common.languages')">
        <div i-ion-language class="text-xl ml-1" />
      </button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="en">
            English
          </el-dropdown-item>
          <el-dropdown-item command="zh-CN">
            中文
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style scoped>

</style>

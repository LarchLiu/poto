<script setup lang="ts">
import { BasicSettingsView } from '@poto/block-basics'
import type { BlockPluginSettings } from '@poto/types'
import { i18nMessages } from '~/constants'
import type { Lineup, Player, Settings } from '~/constants'

const designer = useDesignerStore()
const currentItem = computed(() => designer.getCurrentItem())
const matchSettings = computed(() => (currentItem.value ? (currentItem.value.options as BlockPluginSettings).matchSettings as Settings : undefined))

const { t } = useI18n({
  messages: i18nMessages,
})

const formationRed = ref('')
const formationBlue = ref('')

const lineupR = computed(() => {
  const temp = matchSettings.value ? (matchSettings.value?.teamRed.formation.split('-')).map(i => parseInt(i)) : []
  return [1].concat(temp)
})

const lineupB = computed(() => {
  const temp = matchSettings.value ? (matchSettings.value?.teamBlue.formation.split('-')).map(i => parseInt(i)) : []
  return ([1].concat(temp)).reverse()
})

const formationPass = (value: string) => {
  if (value === '')
    return t('componentSettings.nullError')

  const regex = /^[1-9]-[1-9](-[1-9])?-[1-9]$/

  if (regex.test(value)) {
    const temp = (value.split('-')).map(i => parseInt(i))
    let count = 0
    temp.forEach((i) => {
      count += i
    })
    if (count === 10)
      return ''
    else
      return t('componentSettings.sumError')
  }
  else { return t('componentSettings.regexError') }
}

const formationRedPass = (rule: any, value: any, callback: any) => {
  const str = formationPass(formationRed.value)
  if (str === '')
    callback()
  else
    callback(new Error(str))
}

const formationBluePass = (rule: any, value: any, callback: any) => {
  const str = formationPass(formationBlue.value)
  if (str === '')
    callback()
  else
    callback(new Error(str))
}

const rules = reactive({
  formationRed: [{ validator: formationRedPass, trigger: 'blur' }],
  formationBlue: [{ validator: formationBluePass, trigger: 'blur' }],
})

const formationRedChange = (value: string) => {
  const str = formationPass(value)
  if (str === '') {
    const temp = value ? (value.split('-')).map(i => parseInt(i)) : []
    const formation = [1].concat(temp)
    if (matchSettings.value) {
      const lineup: Lineup = { substitutes: [] }
      formation.forEach((n, i) => {
        const players: Player[] = []
        for (let j = 0; j < n; j++)
          players.push({ name: '', num: 0 })

        lineup[i] = players
      })
      matchSettings.value.teamRed.lineup = lineup
      matchSettings.value.teamRed.formation = value
    }
  }
}

const formationBlueChange = (value: string) => {
  const str = formationPass(value)
  if (str === '') {
    const temp = value ? (value.split('-')).map(i => parseInt(i)) : []
    const formation = ([1].concat(temp)).reverse()
    if (matchSettings.value) {
      const lineup: Lineup = { substitutes: [] }
      formation.forEach((n, i) => {
        const players: Player[] = []
        for (let j = 0; j < n; j++)
          players.push({ name: '', num: 0 })

        lineup[i] = players
      })
      matchSettings.value.teamBlue.lineup = lineup
      matchSettings.value.teamBlue.formation = value
    }
  }
}

watch(() => matchSettings.value?.teamRed.formation, (value) => {
  formationRed.value = value || ''
})

watch(() => matchSettings.value?.teamBlue.formation, (value) => {
  formationBlue.value = value || ''
})

watch(currentItem, (n, o) => {
  // watching options change of item and add to history
  if (!n || !o || n.id !== o.id || designer.ignoreListHis) {
    if (designer.ignoreListHis)
      designer.ignoreListHis = false
    return
  }

  designer.addHistory()
}, {
  deep: true,
})

onMounted(() => {
  formationRed.value = matchSettings.value ? matchSettings.value?.teamRed.formation : '4-3-3'
  formationBlue.value = matchSettings.value ? matchSettings.value?.teamBlue.formation : '4-3-3'
})
</script>

<template>
  <div v-if="!!currentItem">
    <div class="italic font-bold mb-2">
      {{ t('basicSettings.title') }}
    </div>
    <BasicSettingsView />
    <el-form v-if="matchSettings" size="small" :rules="rules">
      <div class="italic font-bold mb-2">
        {{ t('componentSettings.title') }}
      </div>
      <div class="font-bold mb-2">
        {{ t('componentSettings.teamRed') }}
      </div>
      <el-form-item :label="t('componentSettings.name')">
        <el-input v-model="matchSettings.teamRed.name" />
      </el-form-item>
      <el-form-item :label="t('componentSettings.logo')">
        <el-input v-model="matchSettings.teamRed.logo" />
      </el-form-item>
      <el-form-item :label="t('componentSettings.coach')">
        <el-input v-model="matchSettings.teamRed.coach.name" />
      </el-form-item>
      <el-form-item :label="t('componentSettings.formation')" prop="formationRed">
        <el-input v-model="formationRed" @change="formationRedChange" />
      </el-form-item>
      <el-form-item :label="t('componentSettings.lineup')">
        <div v-for="n, i in lineupR" :key="`${n}-${i}`">
          <div>{{ n }}</div>
          <div v-for="m, j in n" :key="`${m}-${j}`" class="mb-2">
            <el-input v-model="matchSettings.teamRed.lineup[i][j].name" />
            <el-input-number v-model="matchSettings.teamRed.lineup[i][j].num" />
          </div>
        </div>
      </el-form-item>
      <div class="font-bold mb-2">
        {{ t('componentSettings.teamBlue') }}
      </div>
      <el-form-item :label="t('componentSettings.name')">
        <el-input v-model="matchSettings.teamBlue.name" />
      </el-form-item>
      <el-form-item :label="t('componentSettings.logo')">
        <el-input v-model="matchSettings.teamRed.logo" />
      </el-form-item>
      <el-form-item :label="t('componentSettings.coach')">
        <el-input v-model="matchSettings.teamBlue.coach.name" />
      </el-form-item>
      <el-form-item :label="t('componentSettings.formation')" prop="formationBlue">
        <el-input v-model="formationBlue" @change="formationBlueChange" />
      </el-form-item>
      <el-form-item :label="t('componentSettings.lineup')">
        <div v-for="n, i in lineupB" :key="`${n}-${i}`">
          <div>{{ n }}</div>
          <div v-for="m, j in n" :key="`${m}-${j}`" class="mb-2">
            <el-input v-model="matchSettings.teamBlue.lineup[i][j].name" />
            <el-input-number v-model="matchSettings.teamBlue.lineup[i][j].num" />
          </div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

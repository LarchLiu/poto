<script setup lang="ts">
import { BasicSettingsView } from '@poto/block-basics'
import type { BlockPluginSettings } from '@poto/types'
import { i18nMessages } from '~/constants'
import type { Lineup, Player, Settings } from '~/constants'

const designer = useDesignerStore()
const currentItem = computed(() => designer.getCurrentItem())
const matchSettings = computed(() => (currentItem.value ? (currentItem.value.options as BlockPluginSettings).matchSettings as Settings : undefined))

const { t, locale } = useI18n({
  messages: i18nMessages,
})

const formationRed = ref('')
const formationBlue = ref('')
const details = ref(false)

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

const rules = {
  formationRed: [{ validator: formationRedPass, trigger: 'blur' }],
  formationBlue: [{ validator: formationBluePass, trigger: 'blur' }],
}

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
          players.push({ name: '', num: 0, goals: 0, assists: 0, yellowCards: 0, redCard: false, score: 0, subOff: false })

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
          players.push({ name: '', num: 0, goals: 0, assists: 0, yellowCards: 0, redCard: false, score: 0, subOff: false })

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
    <el-form v-if="matchSettings" size="small" :rules="rules" :label-width="locale === 'zh-CN' ? '60px' : '100px'">
      <div class="italic font-bold mb-2">
        {{ t('componentSettings.title') }}
      </div>
      <el-form-item :label="t('componentSettings.showGoals')" class="!mb-2">
        <el-switch v-model="matchSettings.showGoals" />
      </el-form-item>
      <el-form-item :label="t('componentSettings.matchTime')" class="!mb-2">
        <el-input v-model="matchSettings.matchTime" />
      </el-form-item>
      <el-form-item :label="t('componentSettings.stadium')" class="!mb-2">
        <el-input v-model="matchSettings.matchStadium" />
      </el-form-item>
      <el-form-item :label="t('componentSettings.showLineup')" class="!mb-2">
        <el-switch v-model="matchSettings.showLineup" />
      </el-form-item>
      <el-form-item :label="t('componentSettings.details')" class="!mb-2">
        <el-switch v-model="details" />
      </el-form-item>
      <div class="font-bold mb-2">
        {{ t('componentSettings.teamRed') }}
      </div>
      <el-form-item :label="t('componentSettings.name')" class="!mb-2">
        <el-input v-model="matchSettings.teamRed.name" />
      </el-form-item>
      <el-form-item :label="t('componentSettings.logo')" class="!mb-2">
        <el-input v-model="matchSettings.teamRed.logo" />
      </el-form-item>
      <el-form-item :label="t('componentSettings.coach')" class="!mb-2">
        <el-input v-model="matchSettings.teamRed.coach.name" />
      </el-form-item>
      <el-form-item :label="t('componentSettings.teamColor')" class="!mb-2">
        <el-color-picker v-model="matchSettings.teamRed.teamColor" />
      </el-form-item>
      <el-form-item :label="t('componentSettings.textColor')" class="!mb-2">
        <el-color-picker v-model="matchSettings.teamRed.textColor" />
      </el-form-item>
      <el-form-item :label="t('componentSettings.goals')" class="!mb-2">
        <el-input-number v-model="matchSettings.teamRed.goals" :min="0" />
      </el-form-item>
      <el-form-item :label="t('componentSettings.formation')" prop="formationRed" class="!mb-2">
        <el-input v-model="formationRed" @change="formationRedChange" />
      </el-form-item>

      <div v-if="matchSettings.showLineup">
        <div class="font-bold mb-2 text-sm">
          {{ t('componentSettings.lineup') }}
        </div>
        <div v-for="n, i in lineupR" :key="`${n}-${i}`">
          <div :style="{ color: `${matchSettings.teamRed.teamColor}` }">
            {{ n }}
          </div>
          <div
            v-for="m, j in n" :id="`red-${n}-${i}-${m}-${j}`"
            :key="`${m}-${j}`" class="mb-2 pt-2 pr-2 border rounded"
            :style="{ borderColor: matchSettings.curPlayer === `red-${n}-${i}-${m}-${j}` ? `${matchSettings.teamRed.teamColor}` : '' }"
          >
            <el-form-item :label="t('componentSettings.name')" class="!mb-2">
              <el-input v-model="matchSettings.teamRed.lineup[i][j].name" />
            </el-form-item>
            <el-form-item :label="t('componentSettings.number')" class="!mb-2">
              <el-input-number v-model="matchSettings.teamRed.lineup[i][j].num" />
            </el-form-item>
            <div v-if="details">
              <el-form-item :label="t('componentSettings.goals')" class="!mb-2">
                <el-input-number v-model="matchSettings.teamRed.lineup[i][j].goals" :min="0" />
              </el-form-item>
              <el-form-item :label="t('componentSettings.assists')" class="!mb-2">
                <el-input-number v-model="matchSettings.teamRed.lineup[i][j].assists" :min="0" />
              </el-form-item>
              <el-form-item :label="t('componentSettings.yellowCards')" class="!mb-2">
                <el-input-number v-model="matchSettings.teamRed.lineup[i][j].yellowCards" :min="0" :max="2" />
              </el-form-item>
              <el-form-item :label="t('componentSettings.redCard')" class="!mb-2">
                <el-switch v-model="matchSettings.teamRed.lineup[i][j].redCard" />
              </el-form-item>
              <el-form-item :label="t('componentSettings.score')" class="!mb-2">
                <el-input-number v-model="matchSettings.teamRed.lineup[i][j].score" :min="0" :step="0.1" :max="10" />
              </el-form-item>
              <el-form-item :label="t('componentSettings.subOff')" class="!mb-2">
                <el-switch v-model="matchSettings.teamRed.lineup[i][j].subOff" />
              </el-form-item>
            </div>
          </div>
        </div>
      </div>
      <div class="font-bold mb-2">
        {{ t('componentSettings.teamBlue') }}
      </div>
      <el-form-item :label="t('componentSettings.name')" class="!mb-2">
        <el-input v-model="matchSettings.teamBlue.name" />
      </el-form-item>
      <el-form-item :label="t('componentSettings.logo')" class="!mb-2">
        <el-input v-model="matchSettings.teamBlue.logo" />
      </el-form-item>
      <el-form-item :label="t('componentSettings.coach')" class="!mb-2">
        <el-input v-model="matchSettings.teamBlue.coach.name" />
      </el-form-item>
      <el-form-item :label="t('componentSettings.teamColor')" class="!mb-2">
        <el-color-picker v-model="matchSettings.teamBlue.teamColor" />
      </el-form-item>
      <el-form-item :label="t('componentSettings.textColor')" class="!mb-2">
        <el-color-picker v-model="matchSettings.teamBlue.textColor" />
      </el-form-item>
      <el-form-item :label="t('componentSettings.goals')" class="!mb-2">
        <el-input-number v-model="matchSettings.teamBlue.goals" :min="0" />
      </el-form-item>
      <el-form-item :label="t('componentSettings.formation')" prop="formationBlue" class="!mb-2">
        <el-input v-model="formationBlue" @change="formationBlueChange" />
      </el-form-item>

      <div v-if="matchSettings.showLineup">
        <div class="font-bold mb-2 text-sm">
          {{ t('componentSettings.lineup') }}
        </div>
        <div v-for="n, i in lineupB" :key="`${n}-${i}`">
          <div :style="{ color: `${matchSettings.teamBlue.teamColor}` }">
            {{ n }}
          </div>
          <div
            v-for="m, j in n" :id="`blue-${n}-${i}-${m}-${j}`"
            :key="`${m}-${j}`" class="mb-2 pt-2 pr-2 border rounded"
            :style="{ borderColor: matchSettings.curPlayer === `blue-${n}-${i}-${m}-${j}` ? `${matchSettings.teamBlue.teamColor}` : '' }"
          >
            <el-form-item :label="t('componentSettings.name')" class="!mb-2">
              <el-input v-model="matchSettings.teamBlue.lineup[i][j].name" />
            </el-form-item>
            <el-form-item :label="t('componentSettings.number')" class="!mb-2">
              <el-input-number v-model="matchSettings.teamBlue.lineup[i][j].num" />
            </el-form-item>
            <div v-show="details">
              <el-form-item :label="t('componentSettings.goals')" class="!mb-2">
                <el-input-number v-model="matchSettings.teamBlue.lineup[i][j].goals" :min="0" />
              </el-form-item>
              <el-form-item :label="t('componentSettings.assists')" class="!mb-2">
                <el-input-number v-model="matchSettings.teamBlue.lineup[i][j].assists" :min="0" />
              </el-form-item>
              <el-form-item :label="t('componentSettings.yellowCards')" class="!mb-2">
                <el-input-number v-model="matchSettings.teamBlue.lineup[i][j].yellowCards" :min="0" :max="2" />
              </el-form-item>
              <el-form-item :label="t('componentSettings.redCard')" class="!mb-2">
                <el-switch v-model="matchSettings.teamBlue.lineup[i][j].redCard" />
              </el-form-item>
              <el-form-item :label="t('componentSettings.score')" class="!mb-2">
                <el-input-number v-model="matchSettings.teamBlue.lineup[i][j].score" :min="0" :step="0.1" :max="10" />
              </el-form-item>
              <el-form-item :label="t('componentSettings.subOff')" class="!mb-2">
                <el-switch v-model="matchSettings.teamBlue.lineup[i][j].subOff" />
              </el-form-item>
            </div>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

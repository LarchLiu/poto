<script setup lang="ts">
import { cloneDeep } from 'lodash'
import { BodyContent, RestApiAction, TransformerAction } from '~/types'
import type { ActionItem, ActionType, Params } from '~/types'
import { UUID, runTransformer } from '~/utils'

const { t } = useI18n()
const actionsStore = useActionsStore()
const openModel = ref(false)
const isAdd = ref(false)
const RestApiActionInitial: RestApiAction<BodyContent> = {
  url: 'https://dummyjson.com/products/1',
  method: 'GET',
  urlParams: [{} as Params],
  headers: [{} as Params],
  cookies: [{} as Params],
  bodyType: 'none',
  body: null,
}

const actionTypes: Array<{ type: ActionType; label: string }> = [{
  type: 'restapi',
  label: 'REST API',
}, {
  type: 'transformer',
  label: 'transformer',
}]

const action = ref<ActionItem>()

const newAction = () => {
  action.value = {
    id: UUID(),
    name: '',
    type: 'restapi',
    content: cloneDeep(RestApiActionInitial),
  }
  openModel.value = true
  isAdd.value = true
}

const apiTest = async () => {
  const { data, error } = await useFetch((action.value?.content as RestApiAction<BodyContent>).url)

  if (data.value) {
    ElNotification({
      title: 'Success',
      message: '',
      type: 'success',
      duration: 2000,
    })
  }
  if (error.value) {
    ElNotification({
      title: 'Error',
      message: error.value,
      type: 'error',
      duration: 2000,
    })
  }
}

const testAction = () => {
  if (action.value?.type === 'restapi') { apiTest() }

  else if (action.value?.type === 'transformer') {
    const data = runTransformer(action.value.content as TransformerAction, '')
    if (data) {
      ElNotification({
        title: 'Success',
        message: JSON.stringify(data),
        type: 'success',
        duration: 2000,
      })
    }
  }
}

const saveAction = () => {
  if (isAdd.value)
    actionsStore.addAction(action.value!)
  openModel.value = false
}

const editAction = (data: ActionItem) => {
  action.value = data
  openModel.value = true
  isAdd.value = false
}
</script>

<template>
  <el-button @click="newAction">
    {{ t('common.add') }}
  </el-button>
  <el-drawer v-model="openModel" direction="rtl">
    <template #header>
      <h4>{{ t('settings.actionsSetting.title') }}</h4>
    </template>
    <template #default>
      <div>
        <el-form-item :label="t('settings.actionsSetting.name')">
          <el-input v-model="action!.name" />
        </el-form-item>
        <el-form-item :label="t('settings.actionsSetting.type')">
          <el-select v-model="action!.type">
            <el-option
              v-for="item in actionTypes"
              :key="item.type"
              :label="item.label"
              :value="item.type"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="action!.type === 'restapi'" :label="t('settings.actionsSetting.url')">
          <el-input v-model="(action!.content as RestApiAction<BodyContent>).url" />
        </el-form-item>
        <el-form-item v-else-if="action!.type === 'transformer'" :label="t('settings.actionsSetting.code')">
          <el-input v-model="(action!.content as TransformerAction).transformerString" type="textarea" :rows="5" />
        </el-form-item>
      </div>
    </template>
    <template #footer>
      <div flex justify-between>
        <el-button type="primary" @click="testAction">
          {{ t('common.test') }}
        </el-button>
        <div>
          <el-button type="primary" @click="openModel = false">
            {{ t('common.cancel') }}
          </el-button>
          <el-button type="primary" @click="saveAction()">
            {{ t('common.save') }}
          </el-button>
        </div>
      </div>
    </template>
  </el-drawer>
  <div v-for="act in actionsStore.actions" :key="act.id">
    <div flex justify-between>
      <div flex items-center>
        <div text-blue-400 :class="act.type === 'restapi' ? 'i-mdi-api' : 'i-mdi-language-javascript'" /> {{ act.name }}
      </div>
      <div flex>
        <div class="i-mdi-note-edit-outline" @click="editAction(act)" />
        <div class="i-mdi-trash-can-outline" />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>

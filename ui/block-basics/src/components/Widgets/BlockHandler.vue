<script setup lang="ts">
import { UUID } from '@poto/utils'
import type { BlockItem, CustomBlock, MenuItem } from '~/types'
import { BlockBasics, i18nMessages } from '~/constants'

const props = defineProps<{
  item: BlockItem
  isPreview?: boolean
}>()
const { t } = useI18n({
  messages: i18nMessages,
})
const designer = useDesignerStore()
const customBlocks = useCustomBlocksStore()
const widgetMenu = useWidgetMenuStore()
const blockPlugins = designer.getBlockPlugins()
const { height: windowHeight } = useWindowSize()
const showMenu = ref(false)
const menuId = UUID()
const handler = ref<HTMLElement | null>(null)
const menuEle = ref<HTMLElement | null>(null)
const dialogSaveVisible = ref(false)
const customBlock = ref<CustomBlock>()

// const menuHeight = computed(() => {
//   return menuEle.value?.offsetHeight || 0
// })

const widgetList = computed(() => {
  return Object.keys(BlockBasics).map((type) => {
    const config = BlockBasics[type].config
    return {
      icon: config.icon!,
      label: t(`common.${config.blockType}`),
      callback: () => {
        designer.addItem(config)
        showMenu.value = false
      },
    }
  })
})

const pluginsList = computed(() => {
  return blockPlugins
    ? [
        {
          divider: true,
        }, {
          icon: 'i-clarity-plugin-line',
          label: t('common.plugins'),
          subMenu: Object.keys(blockPlugins).map((type) => {
            const config = blockPlugins[type].config
            return {
              label: config.options.name,
              callback: () => {
                designer.addItem(config)
                showMenu.value = false
              },
            }
          }),
        },
      ]
    : []
})

const customComponentsSubmenu = computed(() => customBlocks.components.map((component) => {
  return {
    label: component.name,
    callback: () => {
      designer.addItem(component.item)
      showMenu.value = false
    },
  }
}),
)

const saveAsMenu = computed(() => customBlocks.components.map((component) => {
  const update = { ...component, item: { ...props.item, isCustom: true } }
  return {
    label: component.name,
    callback: () => {
      customBlocks.updateComponent(update)
      showMenu.value = false
    },
  }
}),
)

const customComponentsList = computed(() => {
  return [{
    divider: true,
  }, {
    icon: 'i-iconoir-view-structure-up',
    label: t('common.customBlocks'),
    subMenu: customComponentsSubmenu.value,
  }]
})

const addList = computed(() => {
  if (customBlocks.components.length > 0)
    return [...widgetList.value, ...pluginsList.value, ...customComponentsList.value]
  else
    return [...widgetList.value, ...pluginsList.value]
})

const blockMenu = computed(() => {
  const menu: MenuItem[] = [
    {
      icon: 'i-carbon-add',
      label: t('common.add'),
      subMenu: addList.value,
    },
    {
      icon: 'i-carbon-copy',
      label: t('common.clone'),
      callback: () => {
        designer.copyItem(props.item)
        showMenu.value = false
      },
    },
    {
      icon: 'i-fluent-save-24-regular',
      label: t('common.save'),
      callback: () => {
        customBlock.value = {
          id: UUID(),
          name: '',
          description: '',
          item: { ...props.item, isCustom: true },
        }
        // customBlocks.addComponent(component)
        showMenu.value = false
        dialogSaveVisible.value = true
      },
    },
    {
      icon: 'i-carbon-trash-can',
      label: t('common.remove'),
      callback: () => {
        designer.removeItem(props.item)
        showMenu.value = false
      },
    },
  ]
  if (customBlocks.components.length > 0) {
    menu.push({
      icon: 'i-fluent-save-edit-24-regular',
      label: t('common.saveas'),
      subMenu: saveAsMenu.value,
    })
  }
  return menu
})

const saveCustomBlock = () => {
  dialogSaveVisible.value = false
  customBlocks.addComponent(customBlock.value!)
}

const menuHeight = computed(() => {
  return blockMenu.value.length * 40 // 40 as menu item height 2.5rem
})
const menuContainer = ref<HTMLDivElement | null>(null)
const active = ref(0)
// const selected = computed(() => {
//   return designer.isSelected(props.item)
// })
const isWidget = computed(() => {
  return designer.isWidget(props.item)
})
const selectItem = () => {
  if (!props.isPreview)
    designer.selectItem(props.item, true)
}
const contextMenuClick = ({ pageX, pageY }: MouseEvent) => {
  showMenu.value = true
  if (showMenu.value) {
    const width = handler.value?.offsetWidth
    widgetMenu.id = menuId
    widgetMenu.left = pageX + (width || 0)
    widgetMenu.top = (pageY + menuHeight.value) > windowHeight.value ? windowHeight.value - menuHeight.value : pageY
  }
}

document.addEventListener('click', (event: Event) => {
  // Close menu on click outside of menu
  if (!showMenu.value)
    return
  if (!(handler.value && handler.value.contains(event.target as Node))) {
    showMenu.value = false
    active.value = 0
  }
})

watch(() => widgetMenu.id, (value) => {
  if (showMenu.value && value !== menuId)
    showMenu.value = false
})
</script>

<template>
  <div ref="menuContainer" as="div">
    <div
      ref="handler"
      class="handle px-2px rounded-l cursor-grab max-h-24px opacity-60 hover:opacity-100"
      :class="isWidget ? 'bg-blue-200' : 'bg-green-200'"
      @click.stop="selectItem"
      @contextmenu.prevent="contextMenuClick"
    >
      ⠿
    </div>
    <el-dialog v-model="dialogSaveVisible" :title="t('common.customBlock')" width="500px">
      <el-form :model="customBlock">
        <el-form-item :label="t('basicSettings.name')">
          <el-input v-model="customBlock!.name" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="t('common.description')">
          <el-input v-model="customBlock!.description" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogSaveVisible = false">{{ t('common.cancel') }}</el-button>
          <el-button type="primary" @click="saveCustomBlock">
            {{ t('common.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    <Teleport to="#page">
      <div
        v-if="showMenu"
        ref="menuEle"
        class="menu-position w-[10rem] absolute z-10 shadow-block rounded text-neutral-700 text-sm bg-white max-h-[24rem] focus-visible:outline-none top-0"
      >
        <div class="text-left divide-y">
          <div>
            <FloatMenu :data="blockMenu" />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
</style>

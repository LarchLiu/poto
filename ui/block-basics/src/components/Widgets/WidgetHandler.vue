<script setup lang="ts">
import { UUID } from '@poto/utils'
import type { BlockItem, CustomBlock, MenuItem } from '~/types'
import { BlockBasics } from '~/constants'

const props = defineProps<{
  item: BlockItem
  isPreview?: boolean
}>()
const designer = useDesignerStore()
const customBlocks = useCustomBlocksStore()
const widgetMenu = useWidgetMenuStore()
const blockPlugins = designer.getBlockPlugins()
const { height: windowHeight } = useWindowSize()
const showMenu = ref(false)
const menuId = UUID()
const handler = ref<HTMLElement | null>(null)
const menuEle = ref<HTMLElement | null>(null)

// const menuHeight = computed(() => {
//   return menuEle.value?.offsetHeight || 0
// })

const widgetList = Object.keys(BlockBasics).map((type) => {
  const config = BlockBasics[type].config
  return {
    icon: config.icon!,
    label: config.options.name,
    callback: () => {
      designer.addItem(config)
      showMenu.value = false
    },
  }
})

const pluginsList = blockPlugins
  ? [
      {
        divider: true,
      }, {
        icon: 'i-clarity-plugin-line',
        label: 'Plugins',
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
    label: 'Custom',
    subMenu: customComponentsSubmenu.value,
  }]
})

const addList = computed(() => {
  if (customBlocks.components.length > 0)
    return [...widgetList, ...pluginsList, ...customComponentsList.value]
  else
    return [...widgetList, ...pluginsList]
})

const blockMenu = computed(() => {
  const menu: MenuItem[] = [
    {
      icon: 'i-carbon-add',
      label: 'Add',
      subMenu: addList.value,
    },
    {
      icon: 'i-carbon-copy',
      label: 'Copy',
      callback: () => {
        designer.copyItem(props.item)
        showMenu.value = false
      },
    },
    {
      icon: 'i-fluent-save-24-regular',
      label: 'Save',
      callback: () => {
        const component: CustomBlock = {
          id: UUID(),
          name: 'test', // TODO: edit by user
          description: 'test',
          item: { ...props.item, isCustom: true },
        }
        customBlocks.addComponent(component)
        showMenu.value = false
      },
    },
    {
      icon: 'i-carbon-trash-can',
      label: 'Remove',
      callback: () => {
        designer.removeItem(props.item)
        showMenu.value = false
      },
    },
  ]
  if (customBlocks.components.length > 0) {
    menu.push({
      icon: 'i-fluent-save-edit-24-regular',
      label: 'Save as',
      subMenu: saveAsMenu.value,
    })
  }
  return menu
})
const menuHeight = computed(() => {
  return blockMenu.value.length * 40 // 40 as menu item height 2.5rem
})
const menuContainer = ref<HTMLDivElement | null>(null)
const active = ref(0)
const selected = computed(() => {
  return designer.isSelected(props.item)
})
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
      class="handle px-1 rounded-l cursor-grab max-h-24px opacity-60 hover:bg-gray-100 hover:opacity-100"
      :class="selected ? (isWidget ? 'bg-blue-200' : 'bg-green-200') : ''"
      @click.stop="selectItem"
      @contextmenu.prevent="contextMenuClick"
    >
      ⠿
    </div>
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

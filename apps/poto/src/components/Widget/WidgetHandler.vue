<script setup lang="ts">
import type { CustomComponent, Item, MenuItem } from '~/types'
import { UUID } from '~/utils'
import { BlockComponents } from '~/utils/constants'

const props = defineProps<{
  item: Item
}>()
const designer = useDesignerStore()
const customComponents = useCustomComponentsStore()
const widgetMenu = useWidgetMenuStore()
const { height: windowHeight } = useWindowSize()
const showMenu = ref(false)
const menuId = UUID()
const handler = ref<HTMLElement | null>(null)
const menuEle = ref<HTMLElement | null>(null)

// const menuHeight = computed(() => {
//   return menuEle.value?.offsetHeight || 0
// })

const widgetList = Object.keys(BlockComponents).map((type) => {
  const config = BlockComponents[type].config
  return {
    icon: config.icon!,
    label: config.options.name,
    callback: () => {
      designer.addItem(config)
      showMenu.value = false
    },
  }
})

const customComponentsSubmenu = computed(() => customComponents.components.map((component) => {
  return {
    label: component.name,
    callback: () => {
      designer.addItem(component.item)
      showMenu.value = false
    },
  }
}),
)

const saveAsMenu = computed(() => customComponents.components.map((component) => {
  const update = { ...component, item: props.item }
  return {
    label: component.name,
    callback: () => {
      customComponents.updateComponent(update)
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
  if (customComponents.components.length > 0)
    return [...widgetList, ...customComponentsList.value]
  else
    return [...widgetList]
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
        const component: CustomComponent = {
          id: UUID(),
          name: 'test',
          description: 'test',
          item: props.item,
        }
        customComponents.addComponent(component)
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
  if (customComponents.components.length > 0) {
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
            <!-- <div
              v-for="option, i in blockMenu"
              :key="option.label"
              class="px-2 py-1 rounded flex items-center gap-2 cursor-pointer"
              :class="[active === i ? 'bg-neutral-100' : '']"
              @mousedown="option.callback"
              @mouseover="active = i"
            >
              <div :class="option.icon" />
              <span class="truncate">{{ option.label }}</span>
            </div> -->
            <FloatMenu :data="blockMenu" />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
</style>

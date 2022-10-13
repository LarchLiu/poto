<script lang="ts">
import type { PropType } from 'vue'
import type { MenuItem, MenuTheme } from '~/types'

const MenuThemeDefault = {
  primary: '#0080ff',
  textColor: '#000',
  menuBgColor: '#fff',
  textSelectedColor: '#fff',
  hoverBackground: '#89c4ff',
}

export default defineComponent({
  name: 'FloatMenu',
  props: {
    data: {
      type: Array as PropType<MenuItem[]>,
      default: () => [],
    },
    flip: {
      type: Boolean,
      default: false,
    },
    onClose: {
      type: Function as PropType<(keyCodeUsed?: string) => void>,
      default: null,
      required: false,
    },
    theme: {
      type: Object as PropType<MenuTheme>,
      required: false,
      default: MenuThemeDefault,
    },
    menuStyle: {
      type: String,
      default: 'slide-out',
      required: false,
    },
  },
  setup(props) {
    const { height: windowHeight } = useWindowSize()
    const subMenuTop = ref('0px')
    const currentSubmenuId = ref<string | undefined>('')
    // tracks the index of the selected menu item
    const activeIndex = ref(-1)

    // gene unique ids for the menu items
    const menuItems = ref<MenuItem[]>(
      props.data.map(item =>
        Object.assign({}, item, {
          id: `menu-item-${Math.random().toString(16)}`,
          showSubMenu: false,
        }),
      ),
    )

    // reference to the menu itself
    const menuRef = ref()

    // resolve this component for usage innested menus
    const SubMenuComponent = resolveComponent('FloatMenu')

    const toggleMenu = (subMenu: boolean, id?: string, selectFirstItem?: boolean) => {
      menuItems.value = menuItems.value.map(item =>
        Object.assign({}, item, {
          showSubMenu: item.id === id && subMenu,
          subMenu:
            selectFirstItem && item.id === id
              ? {
                  items: item.subMenu?.map((x, index) =>
                    Object.assign({}, x, {
                      selected: index === 0,
                    }),
                  ),
                }
              : item.subMenu,
        }),
      )
    }

    const selectMenuItem = (
      subMenu: boolean,
      callback?: () => void,
    ) => {
      if (!subMenu)
        callback && callback()
    }

    // expands the submenu

    const handleMenuItemClick = (
      event: MouseEvent,
      calback?: () => void,
      subMenu?: MenuItem[],
      index?: number,
      disabled?: boolean,
      divider?: boolean,
    ) => {
      event.stopPropagation()
      event.preventDefault()

      if (disabled || divider)
        return

      activeIndex.value = index || 0

      selectMenuItem(!!subMenu, calback)
    }

    const handleMenuItemOver = (event: MouseEvent, id?: string, subMenu?: MenuItem[]) => {
      if (currentSubmenuId.value === id)
        return

      currentSubmenuId.value = id
      if (subMenu) {
        let subMenuHeight = 0
        subMenu.forEach((i) => {
          if (i.divider)
            subMenuHeight += 16 // divider 1rem
          else
            subMenuHeight += 40 // submenu 2.5rem
        })
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
        subMenuTop.value = `${(rect.y + subMenuHeight) > windowHeight.value ? windowHeight.value - (rect.y + subMenuHeight) : 0}px`
      }
      else {
        subMenuTop.value = '0px'
      }

      toggleMenu(!!subMenu, id, false)
    }

    // gets theme colors
    const getTheme = computed(() => ({
      '--background': props.theme.primary,
      '--menu-background': props.theme.menuBgColor,
      '--menu-text-color': props.theme.textColor,
      '--text-selected-color': props.theme.textSelectedColor,
      '--hover-background': props.theme.hoverBackground,
    }))

    // life cycle mount
    onMounted(() => {
      // focus the menu on mount
      menuRef.value?.focus()

      // reset the activeindex to 0, if first item is already selected.
      // this is mostly the case while navigating via keyboard
      nextTick(() => {
        const isFirstItemSelected = props.data[0]?.selected
        if (isFirstItemSelected)
          activeIndex.value = 0
      })
    })

    const handleSubmenuClose = () => {
      menuItems.value = menuItems.value.map((item) => {
        return Object.assign({}, item, {
          showSubMenu: false,
        })
      })
      menuRef.value?.focus()
    }

    const subMenuClass = computed(() => `sub-menu-wrapper ${props.menuStyle}`)

    const menuItemClass = computed(
      () => `menu-item-wrapper ${props.menuStyle}`,
    )

    const isAccordion = computed(() => props.menuStyle === 'accordion')

    return {
      menuItems,
      handleMenuItemClick,
      handleMenuItemOver,
      SubMenuComponent,
      getTheme,
      menuRef,
      activeIndex,
      handleSubmenuClose,
      subMenuClass,
      menuItemClass,
      isAccordion,
      subMenuTop,
    }
  },
})
</script>

<template>
  <div
    ref="menuRef"
    class="menu-wrapper"
    tabindex="0"
  >
    <ul
      class="menu-list"
      :style="getTheme"
    >
      <li
        v-for="(
          {
            id,
            selected,
            label,
            subMenu,
            showSubMenu,
            disabled,
            divider,
            icon,
            callback,
          },
          index
        ) of menuItems"
        :key="id"
        class="menu-list-item"
        :class="[
          { 'sub-menu': subMenu, selected, disabled, flip, divider },
          menuStyle,
        ]"
        :style="getTheme"
        @mousedown="handleMenuItemClick(
          $event,
          callback,
          subMenu,
          index,
          disabled,
          divider,
        )"
        @mouseover="
          handleMenuItemOver(
            $event,
            id,
            subMenu,
          )
        "
      >
        <template v-if="!divider">
          <div
            :class="menuItemClass"
            @click="$event.stopPropagation()"
          >
            <span
              v-if="icon"
              class="menu-item-icon"
            >
              <div :class="icon" class="text-lg" />
            </span>
            <span class="name" :class="[{ disabled }]">{{ label }}</span>
            <span
              v-if="subMenu"
              class="chev-icon flex items-center" :class="[
                { disabled, 'show-submenu': showSubMenu },
                menuStyle,
              ]"
            >
              <div v-if="!isAccordion" class="i-iconoir-nav-arrow-right" text-lg />
              <div v-if="subMenu && !showSubMenu && isAccordion" class="i-iconoir-plus" text-lg />
              <div v-if="subMenu && showSubMenu && isAccordion" class="i-iconoir-minus" text-lg />
            </span>
          </div>
          <div
            v-if="!disabled && showSubMenu"
            :class="subMenuClass"
            :style="getTheme"
          >
            <component
              :is="SubMenuComponent"
              :data="subMenu"
              :theme="theme"
              :on-close="handleSubmenuClose"
              :flip="flip"
              :menu-style="menuStyle"
            >
              <template
                v-for="slot in Object.keys($slots)"
                #[slot]="scope"
              >
                <slot
                  :name="slot"
                  v-bind="scope"
                />
              </template>
            </component>
          </div>
        </template>
        <template v-else>
          <span class="menu-item-divider" />
        </template>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
  $black: #000;
  $white: #fff;
  $light-gray: #e5e5e5;
  $shadow: rgb(0 0 0 / 20%) 2px 2px 10px 2px;
  .menu-wrapper {
    align-items: flex-start;
    display: flex;
    height: 100%;
    justify-content: flex-start;
    width: 100%;
    outline: 0;
    z-index: 9999;
  }

  .sub-menu-wrapper {
    animation: show 0.1s ease-in;
    min-width: 160px;

    &.slide-out {
      border-radius: 4px;
      box-shadow: $shadow;
      left: 102%;
      top: v-bind(subMenuTop);
      position: absolute;
      background: var(--menu-background);
    }

    &.accordion {
      width: 99%;
      margin-left: auto;
      max-height: 900px;
      transition: max-height 0.5s ease;
    }
  }

  .chev-icon {
    width: 1.5rem;
    height: 1.5rem;

    &.disabled {
      opacity: 0.45;
    }
  }

  .menu-list {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    list-style: none;
    margin: 0;
    padding: 0;
    width: 100%;

    .name {
      padding-left: 0.5rem;

      &.disabled {
        filter: opacity(0.45);
      }
    }
  }

  .menu-item-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    min-height: 2.5rem;

    &.slide-out {
      .name {
        order: 1;
      }

      .chev-icon {
        order: 2;
        margin-left: auto;
      }
    }

    &.accordion {
      .name {
        order: 2;
      }

      .chev-icon {
        order: 1;
      }
    }
  }

  .menu-item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 0.5rem;
  }

  .menu-list-item {
    align-items: center;
    color: var(--menu-text-color);
    cursor: pointer;
    display: flex;
    font-size: 0.9rem;
    justify-content: flex-start;
    position: relative;
    width: 100%;

    &.divider {
      height: 1rem;
      cursor: default;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &.accordion {
      flex-direction: column;

      &.selected:not(.divider) {
        max-height: 900px;
      }
    }

    &.slide-out:not(.divider) {
      height: 2.5rem;

      &:hover {
        background-color: var(--hover-background);
        color: var(--text-selected-color);
      }
    }

    &:first-child {
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }

    &:last-child {
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
    }

    &.selected {
      background-color: rgba(#cccc, 0.5);
    }

    &.highlight {
      border: 1px solid red;
    }

    &.flip {
      .name {
        margin-left: auto;
        order: 2;
        padding-left: 0;
        padding-right: 0.5rem;
      }

      .chev-icon {
        margin-left: 0;
        order: 1;
        transform: rotate(-180deg);
      }

      .sub-menu-wrapper {
        left: auto;
        right: 102%;
      }

      .menu-item-icon {
        order: 3;
      }
    }

    &.disabled {
      cursor: default;
    }
  }

  .menu-item-divider {
    width: 95%;
    background: rgb(0 0 0 / 10%);
    display: block;
    height: 1px;
    margin: 0 auto;
    pointer-events: none;
  }

  @keyframes show {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }
</style>

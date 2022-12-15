// https://github.com/samuelmeuli/font-picker-react
<script lang="ts" setup>
import type { Font, Options } from '@samuelmeuli/font-manager'
import { FontManager } from '@samuelmeuli/font-manager'
import { i18nMessages } from '~/constants'
import { config } from '~/config'

type LoadingStatus = 'loading' | 'finished' | 'error'

const props = defineProps<{
  activeFont?: string
  options: Options
  suffix: string
}>()
const emit = defineEmits(['change'])
const fontManager = ref<FontManager>()
const expanded = ref(false)
const loadingStatus = ref<LoadingStatus>('loading')
const { t } = useI18n({
  messages: i18nMessages,
})
const defaultFont: Font = {
  family: 'Default',
  id: 'none',
  category: 'sans-serif',
  scripts: [],
  variants: [],
}

const getFontId = (fontFamily: string): string => {
  return fontFamily.replace(/\s+/g, '-').toLowerCase()
}

/**
 * EventListener for closing the font picker when clicking anywhere outside it
 */
const onClose = (e: MouseEvent): void => {
  let targetEl = e.target as Node // Clicked element
  const fontPickerEl = document.getElementById(`font-picker${fontManager.value?.selectorSuffix}`)

  while (true) {
    if (targetEl === fontPickerEl) {
      // Click inside font picker: Exit
      return
    }
    if (targetEl.parentNode) {
      // Click outside font picker: Move up the DOM
      targetEl = targetEl.parentNode
    }
    else {
      // DOM root is reached: Toggle picker, exit
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      toggleExpanded()
      return
    }
  }
}

/**
 * Expand/collapse the picker's font list
 */
const toggleExpanded = (): void => {
  if (expanded.value) {
    expanded.value = false
    document.removeEventListener('click', onClose)
  }
  else {
    expanded.value = true
    document.addEventListener('click', onClose)
  }
}

/**
 * Set the specified font as the active font in the fontManager and update activeFontFamily in the
 * state
 */
const setActiveFontFamily = (activeFontFamily: string): void => {
  fontManager.value?.setActiveFont(activeFontFamily)
}

/**
 * Update the active font on font button click
 */
const onSelection = (e: MouseEvent | KeyboardEvent): void => {
  const target = e.target as HTMLButtonElement
  const activeFontFamily = target.textContent
  if (!activeFontFamily)
    throw new Error('Missing font family in clicked font button')

  if (activeFontFamily === 'Default')
    emit('change', defaultFont)
  else
    setActiveFontFamily(activeFontFamily)
  toggleExpanded()
}

const fontsList = computed(() => {
  if (fontManager.value) {
    const fonts = Array.from(fontManager.value.getFonts().values())
    if (props.options.sort === 'alphabet') {
      fonts.sort((font1: Font, font2: Font): number =>
        font1.family.localeCompare(font2.family),
      )
    }

    fonts.unshift(defaultFont)
    return fonts
  }
  return []
})

onMounted(() => {
  if (config.googleFontsApiKey) {
    fontManager.value = new FontManager(
      config.googleFontsApiKey,
      props.activeFont === 'Default' ? 'Open Sans' : props.activeFont,
      props.options,
      (font: Font) => {
        emit('change', font)
      },
    )
    if (props.suffix)
      fontManager.value.selectorSuffix = props.suffix
    fontManager.value
      .init()
      .then((): void => {
        loadingStatus.value = 'finished'
      })
      .catch((err: Error): void => {
      // On error: Log error message
        loadingStatus.value = 'error'
        console.error('Error trying to fetch the list of available fonts')
        console.error(err)
      })
  }
})
</script>

<template>
  <el-form-item v-if="config.googleFontsApiKey" size="small" :label="t('basicSettings.fonts')">
    <div
      v-if="fontManager"
      :id="`font-picker${fontManager.selectorSuffix}`"
      :class="expanded ? 'expanded' : ''"
    >
      <button
        type="button"
        class="dropdown-button"
        @keypress="toggleExpanded"
        @click="toggleExpanded"
      >
        <p class="dropdown-font-family">
          {{ activeFont }}
        </p>
        <p class="dropdown-icon" :class="[`${loadingStatus}`]" />
      </button>
      <ul v-if="loadingStatus === 'finished'" class="font-list">
        <li v-for="font in fontsList" :key="getFontId(font.family)" class="font-list-item">
          <button
            :id="`font-button-${getFontId(font.family)}${fontManager.selectorSuffix}`"
            type="button"
            class="font-button"
            :class="font.family === activeFont ? 'active-font' : ''"
            @click="onSelection"
            @keypress="onSelection"
          >
            {{ font.family }}
          </button>
        </li>
      </ul>
    </div>
  </el-form-item>
</template>

<style lang="scss" scoped>
  :deep(.dropdown-button) {
    background: white !important;
    height: 24px !important;
  }
  :deep(.font-list) {
    z-index: 100 !important;
  }
  :deep(.font-list-item) {
    height: 24px !important;
  }
</style>

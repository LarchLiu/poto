import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['btn', 'px-4 py-1 rounded inline-block bg-teal-700 text-white cursor-pointer hover:bg-teal-800 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    ['icon-btn', 'inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:scale-120'],
  ],
  rules: [
    ['shadow-block', { 'box-shadow': 'rgb(0 0 0 / 20%) 2px 2px 10px 2px' }],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1,
      warn: true,
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  variants: [
    // hover:
    (matcher) => {
      if (!matcher.startsWith('group-hover:'))
        return matcher
      return {
        // slice `hover:` prefix and passed to the next variants and rules
        matcher: matcher.slice(12),
        selector: s => `${s}:hover`,
      }
    },
  ],
  safelist: 'prose prose-sm m-auto text-left'.split(' '),
  include: [/.*\/poto-block-basic\.js(.*)?$/, './**/*.vue', './**/*.md'],
})

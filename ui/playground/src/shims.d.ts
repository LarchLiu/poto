declare interface Window {
  // extend the window
}

// with vite-plugin-vue-markdown, markdown files can be treated as Vue components
declare module '*.md' {
  import { type DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.vue' {
  import { type DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'get-contrast' {
  interface Options {
    ignoreAlpha: boolean
  }
  const ratio = (colorOne: string, colorTwo: string, options?: Options): number => {}
  const score = (colorOne: string, colorTwo: string, options?: Options): string => {}
  const isAccessible = (colorOne: string, colorTwo: string, options?: Options): boolean => {}
  export {
    ratio,
    score,
    isAccessible
  }
}

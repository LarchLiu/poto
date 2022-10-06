import type { Arrayable } from '@antfu/utils'
import type { Import } from 'unimport'

export type WidgetPluginName = string

export interface ImportExtended extends Import {
  sideEffects?: SideEffectsInfo
  __source?: 'dir' | 'resolver'
}

export type SideEffectsInfo = Arrayable<ResolverResult | string> | undefined

export interface ResolverResult {
  as?: string
  name?: string
  from: string
}

export interface Options {
  /**
   * Preset names or custom imports map
   *
   * @default []
   */
  imports?: Arrayable<WidgetPluginName>

  /**
   * Path for directories to be auto imported
   */
  dirs?: string[]

  /**
   * Path for export file
   * @default 'src/poto-auto-imports.ts'
   */
  exportPath?: string

  /**
   * File filter of dirs
   * @default (filePath: string) => true
   */
  fileFilter?: (filePath: string) => boolean

  /**
   * Allow overriding imports sources.
   *
   * @default false
   */
  overriding?: boolean

  /**
   * Generate source map.
   *
   * @default false
   */
  sourceMap?: boolean
}

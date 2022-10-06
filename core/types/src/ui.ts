import type { SourceData } from './action'

export enum BlockType {
  Title = 'TITLE',
  Markdown = 'MARKDOWN',
  Text = 'TEXT',
  Div = 'DIV',
  Group = 'GROUP',
  List = 'LIST',
  Columns2 = '2COLUMNS',
  Columns3 = '3COLUMNS',
}

export type BlockPluginType = string

export interface Border {
  has: boolean
  width: number[]
  style: 'solid' | 'dashed' | 'dotted' | 'double' | 'none'
  radius: number[]
  color: EleColor
}

export interface ColorOptions {
  colors: string[]
  opacity: number
  degree: number
  gradient: boolean
  url: string
}

export interface EleColor {
  type: 'single' | 'colorful' | 'image'
  options: ColorOptions
}

export interface Font {
  size: string
  family?: string
  color: EleColor
  weight: number
  style: 'normal' | 'italic'
  decoration: 'none' | 'underline' | 'line-through' | 'overline'
}

export interface Size {
  width: number
  height: number
}

export interface BasicSettings {
  name: string
  list?: Array<BlockItem>
  border: Border
  size: Size
  backgroundColor: EleColor
  padding: number[]
  margin: number[]
  sourceData?: SourceData
  hasParentData?: Boolean
}

export interface TextSettings extends BasicSettings {
  text: string
  font: Font
  align: 'left' | 'center' | 'right'
}

export interface Flex {
  display: 'flex' | 'inline-flex'
  direction: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  wrap: 'nowrap' | 'wrap' | 'wrap-reverse'
  justifyContent: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around'
  alignItems: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'
  grow: number
  shrink: number
  basis: number
}

export interface GroupSettings extends BasicSettings {
  containerType: 'flex' | 'grid' | 'absolute'
  flex: Flex
}

export interface BlockPluginSettings extends BasicSettings {
  [key: string]: any
}

export interface BlockItem {
  id?: string
  icon?: string
  author?: string
  blockType: BlockType | BlockPluginType
  category: 'widget' | 'group'
  options: TextSettings | GroupSettings | BlockPluginSettings
}

export interface FindedItem {
  parentList: Array<BlockItem> | undefined
  index: number
  item?: BlockItem
}

export interface CustomBlock {
  id: string
  name: string
  description: string
  item: BlockItem
}

export interface MenuItem {
  /**
   * display name of the Menu item
   *
   */
  label?: string
  /**
   * data for the sub menu
   *
   */
  subMenu?: MenuItem[]
  /**
   * unique id (this is auto generated)
   *
   */
  id?: string
  /**
   * flag to show the sub menu
   *
   */
  showSubMenu?: boolean
  /**
   * used to highlight the selection. used for styling purpose.
   *
   */
  selected?: boolean
  /**
   * disables the menu item. all interactions are disabled
   *
   */
  disabled?: boolean

  divider?: boolean

  icon?: string

  callback?: () => void
}

export interface MenuTheme {
  /**
   * targets the bg color of the menu head and selection highlight for sub menus.
   *
   */
  primary: string

  /**
   * targets the text color
   *
   */
  textColor: string

  /**
   * targets the background color of the menu
   *
   */
  menuBgColor: string

  /**
   * targets the text color of the menu item when the item has a sub menu
   *
   */
  textSelectedColor: string

  hoverBackground: string
}


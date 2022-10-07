import type { App } from 'vue'
import type { RouteRecordRaw, Router } from 'vue-router'
import type { HeadClient } from '@vueuse/head'

interface AppContext<HasRouter extends boolean = true> {
  app: App<Element>
  router: HasRouter extends true ? Router : undefined
  routes: HasRouter extends true ? RouteRecordRaw[] : undefined
  head?: HeadClient | undefined
}

export type UserModule = (ctx: AppContext) => void

export interface Params {
  key: string
  value: string
}

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

export type ActionType =
  | 'restapi'
  | 'transformer'
  | 'byparent'

export interface TransformerAction {
  transformerString: string
}

export interface ByParentAction {
  propName: string
}

export type BodyType =
  | 'none'
  | 'form-data'
  | 'x-www-form-urlencoded'
  | 'raw'
  | 'binary'

export type RawBodyType = 'text' | 'json' | 'xml' | 'javascript' | 'html'

export type NoneBody = null

export type XWWWFormURLEncodedBody = Params[]

export type BinaryBody = string

export type FormDataBody = Params[]

export type TextRawBody = string

export type JavaScriptRawBody = string

export type JSONRawBody = string

export type HTMLRawBody = string

export type XMLRawBody = string

export interface RawBody<T extends RawBodyContent> {
  type: RawBodyType
  content: T
}

export type RawBodyContent =
  | TextRawBody
  | JavaScriptRawBody
  | JSONRawBody
  | HTMLRawBody
  | XMLRawBody

export type BodyContent =
  | NoneBody
  | FormDataBody
  | XWWWFormURLEncodedBody
  | BinaryBody
  | RawBody<RawBodyContent>

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export interface RestApiAction<T extends BodyContent> {
  method: ApiMethod
  url: string
  urlParams: Params[]
  headers: Params[]
  cookies: Params[]
  bodyType: BodyType
  body: T
}

export type ActionContent =
  | RestApiAction<BodyContent>
  | TransformerAction
  | ByParentAction

export interface Transformer {
  rawData: string
  enable: boolean
}

export interface Details {
  value?: string
}

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

export interface ActionItem {
  id: string
  name: string
  type: ActionType
  content: ActionContent
}

export interface SourceData {
  enable: boolean
  actionId: string
  transformer: Transformer
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
  list?: Array<Item>
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
  [key: string]: any
}

export interface Item {
  id?: string
  icon?: string
  type: 'widget' | 'group'
  blockType: BlockType
  options: TextSettings | GroupSettings
}

export interface FindedItem {
  parentList: Array<Item> | undefined
  index: number
  item?: Item
}

export interface CustomComponent {
  id: string
  name: string
  description: string
  item: Item
}

export interface MenuItem {
  /**
   * display name of the Menu item
   *
   * @type {string}
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
   * @type {string}
   */
  id?: string
  /**
   * flag to show the sub menu
   *
   * @type {boolean}
   */
  showSubMenu?: boolean
  /**
   * used to highlight the selection. used for styling purpose.
   *
   * @type {boolean}
   */
  selected?: boolean
  /**
   * disables the menu item. all interactions are disabled
   *
   * @type {boolean}
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
       * @type {string}
       */
  primary: string

  /**
   * targets the text color
   *
   * @type {string}
   */
  textColor: string

  /**
   * targets the background color of the menu
   *
   * @type {string}
   */
  menuBgColor: string

  /**
   * targets the text color of the menu item when the item has a sub menu
   *
   * @type {string}
   */
  textSelectedColor: string

  hoverBackground: string
}


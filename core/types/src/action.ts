import type { BodyContent, RestApiAction } from './rest-api'

export interface ActionItem {
  id: string
  name: string
  type: ActionType
  content?: ActionContent
}

export interface DesignerActionItem extends ActionItem {
  /**
   * from global action's id
   */
  fromId?: string
}

export interface SourceData {
  enable: boolean
  actionId: string
  actionItem?: DesignerActionItem
  transformer: Transformer
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

export type ActionContent =
  | RestApiAction<BodyContent>
  | TransformerAction
  | ByParentAction

export interface Transformer {
  rawData: string
  enable: boolean
}


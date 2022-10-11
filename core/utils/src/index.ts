import { camelCase } from 'scule'
import { v4 as uuidv4 } from 'uuid'
import type { BlockItem } from '@poto/types'
export * from './evaluateDynamicString'

export function camelCaseWithoutAt(str: string) {
  return camelCase(str.replaceAll('@', ''))
}

export const UUID = () => {
  return uuidv4()
}

const setID = (item: BlockItem) => {
  if (item.options.list) {
    item.options.list.map((i) => {
      return setID(i)
    })
  }
  item.id = UUID()
  return item
}

export const deepClone = (src: any) => {
  return JSON.parse(JSON.stringify(src))
}

export const cloneItem = (item: BlockItem) => {
  const i: BlockItem = deepClone(item)
  return setID(i)
}

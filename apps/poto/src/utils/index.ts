import { v4 as uuidv4 } from 'uuid'
import type { BlockItem } from '~/types'

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

export const cloneItem = (item: BlockItem) => {
  const i: BlockItem = JSON.parse(JSON.stringify(item))
  return setID(i)
}

import { v4 as uuidv4 } from 'uuid'
import type { Item } from '~/types'

export const UUID = () => {
  return uuidv4()
}

const setID = (item: Item) => {
  if (item.options.list) {
    item.options.list.map((i) => {
      return setID(i)
    })
  }
  item.id = UUID()
  return item
}

export const cloneItem = (item: Item) => {
  const i: Item = JSON.parse(JSON.stringify(item))
  return setID(i)
}

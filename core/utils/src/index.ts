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

// Define the recursive function to deep clone the array
function deepCloneArray(arr: any[]): any[] {
  // Create a new array to hold the cloned items
  const arrClone = []

  // Loop through the items in the array
  for (let i = 0; i < arr.length; i++) {
    // Get the current item
    const item = arr[i]

    // Check if the item is an array
    if (Array.isArray(item)) {
      // The item is an array, so clone it recursively
      arrClone.push(deepCloneArray(item))
    }
    else if (typeof item === 'object' && item !== null) {
      // The item is an object, so clone it recursively
      arrClone.push(deepCloneObject(item))
    }
    else {
      // The item is not an array or an object, so clone it directly
      arrClone.push(item)
    }
  }

  // Return the cloned array
  return arrClone
}

// Define the recursive function to deep clone an object
function deepCloneObject(obj: any) {
  // Create a new object to hold the cloned properties
  const objClone = {} as any

  // Loop through the properties of the object
  for (const prop in obj) {
    // Get the current property
    const property = obj[prop]

    // Check if the property is an array
    if (Array.isArray(property)) {
      // The property is an array, so clone it recursively
      objClone[prop] = deepCloneArray(property)
    }
    else if (typeof property === 'object' && property !== null) {
      // The property is an object, so clone it recursively
      objClone[prop] = deepCloneObject(property)
    }
    else {
      // The property is not an array or an object, so clone it directly
      objClone[prop] = property
    }
  }

  // Return the cloned object
  return objClone
}

export const cloneItem = (item: BlockItem) => {
  const i: BlockItem = deepCloneObject(item) // deepClone(item)
  return setID(i)
}

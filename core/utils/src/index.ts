import { camelCase } from 'scule'

export function camelCaseWithoutAt(str: string) {
  return camelCase(str.replaceAll('@', ''))
}

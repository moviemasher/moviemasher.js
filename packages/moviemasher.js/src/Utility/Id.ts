import { NumberObject } from "../declarations"

// eslint-disable-next-line prefer-const
export let idPrefix = ''
export let idCount = 0

const idCountsByPrefix: NumberObject = {}
export const idGenerate = (prefix = idPrefix): string => {
  const components:string[] = []
  if (prefix) {
    components.push(prefix)
    idCountsByPrefix[prefix] ||= 0
    components.push(String(idCountsByPrefix[prefix]++))
  } else components.push(String(idCount++))
  return components.join('')
}

export const idPrefixSet = (prefix: string): void => { idPrefix = prefix }

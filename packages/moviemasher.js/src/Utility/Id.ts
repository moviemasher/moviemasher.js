import { NumberObject } from "../declarations"
import { isPopulatedString } from "./Is"

const Id = {
  count: 0,
  prefix: '',
  countsByPrefix: {} as NumberObject
}

export const idGenerateString = (): string => {
  const components:string[] = []
  if (Id.prefix) components.push(Id.prefix)

  components.push(Date.now().toString(36))
  components.push(Math.random().toString(36).slice(2))
  return components.join('-')
}

export const idPrefixSet = (prefix: string): void => { Id.prefix = prefix }

export const idTemporary = () => {
  const { prefix } = Id
  const components:string[] = []
  if (prefix) {
    components.push(prefix)
    Id.countsByPrefix[prefix] ||= 0
    components.push(String(Id.countsByPrefix[prefix]++))
  } else components.push(String(Id.count++))
  return components.join('')
}

export const idGenerate = (prefix = Id.prefix): string => {
  const components:string[] = []
  if (prefix) {
    components.push(prefix)
    Id.countsByPrefix[prefix] ||= 0
    components.push(String(Id.countsByPrefix[prefix]++))
  } else components.push(String(Id.count++))
  return components.join('')
}

export const idIsTemporary = (id: string): boolean => {
  if (!isPopulatedString(Id.prefix)) return false

  return id.startsWith(Id.prefix)
}
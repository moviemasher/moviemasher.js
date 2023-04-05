import { MediaType, isMediaType, isSelectorType, isString, Property, SelectorType, CommaChar } from "@moviemasher/lib-core"

const propsStringArray = (string?: string, array?: string | string[], properties?: Property[]): string[] => {
  if (string) return [string]

  if (!array) return properties ? properties.map(property => property.name) : []

  if (isString(array)) return array.split(CommaChar).map(string => string.trim())

  return array
}

export const propsMediaTypes = (type?: string, types?: string | string[], id?: string): MediaType[] => {
  const strings = propsStringArray(type, types)
  if (id && !strings.length) strings.push(id)
  const validStrings = strings.filter(string => isMediaType(string))
  return validStrings.map(string => string as MediaType)
}


export const propsSelectorTypes = (type?: string, types?: string | string[], id?: string): SelectorType[] => {
  const strings = propsStringArray(type, types)
  if (id && !strings.length) strings.push(id)
  const validStrings = strings.filter(string => isSelectorType(string))
  return validStrings.map(string => string as SelectorType)
}


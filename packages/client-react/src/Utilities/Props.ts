import { MediaType, isMediaType, isSelectType, isString, Property, SelectType } from "@moviemasher/moviemasher.js"

const propsStringArray = (string?: string, array?: string | string[], properties?: Property[]): string[] => {
  if (string) return [string]

  if (!array) return properties ? properties.map(property => property.name) : []

  if (isString(array)) return array.split(',').map(string => string.trim())

  return array
}

export const propsMediaTypes = (type?: string, types?: string | string[], id?: string): MediaType[] => {
  const strings = propsStringArray(type, types)
  if (id && !strings.length) strings.push(id)
  const validStrings = strings.filter(string => isMediaType(string))
  return validStrings.map(string => string as MediaType)
}


export const propsSelectTypes = (type?: string, types?: string | string[], id?: string): SelectType[] => {
  const strings = propsStringArray(type, types)
  if (id && !strings.length) strings.push(id)
  const validStrings = strings.filter(string => isSelectType(string))
  return validStrings.map(string => string as SelectType)
}

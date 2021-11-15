import { DefinitionType, DefinitionTypes, Property } from "@moviemasher/moviemasher.js"

const propsStringArray = (string?: string, array?: string | string[], properties?: Property[]): string[] => {
  if (string) return [string]

  if (!array) return properties ? properties.map(property => property.name) : []

  if (typeof array === 'string') return array.split(',').map(string => string.trim())

  return array
}

const propsDefinitionTypes = (type?:string, types?: string | string[], id?: string): DefinitionType[] => {
  const strings = propsStringArray(type, types)
  if (id && !strings.length) strings.push(id)
  const definitionTypes = DefinitionTypes.map(String)
  const validStrings = strings.filter(string => definitionTypes.includes(string))
  // console.debug("propsDefinitionTypes", validStrings)
  return validStrings.map(string => string as DefinitionType)
}


const Props = {
  stringArray: propsStringArray,
  definitionTypes: propsDefinitionTypes,
}

export {
  Props,
  propsStringArray,
  propsDefinitionTypes,
}

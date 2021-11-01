import { Property } from "@moviemasher/moviemasher.js"

const propsStringArray = (string?: string, array?: string | string[], properties?: Property[]): string[] => {
  if (string) return [string]

  if (!array) return properties ? properties.map(property => property.name) : []

  if (typeof array === 'string') return array.split(',').map(string => string.trim())

  return array
}

const Props = {
  stringArray: propsStringArray,
}

export {
  Props,
  propsStringArray,
}

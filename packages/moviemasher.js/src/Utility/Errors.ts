import { JsonObject } from "../declarations"

export interface ErrorsObject extends JsonObject {
  message: string
}
export const errorsThrow = (value: any, expected: string, name = "value") => {
  const type = typeof value
  const typeName = type === 'object' ? value.constructor.name : type
  const message = `${name} is ${typeName} '${value}' instead of ${expected}`
  console.trace(message)
  throw new Error(message)
}

export const errorsCatch = (value: any): ErrorsObject => {
  return { message: value.message || 'unknown' }
}



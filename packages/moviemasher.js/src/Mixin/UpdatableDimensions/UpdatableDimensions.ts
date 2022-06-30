import { Constrained } from "../../declarations"
import { Dimensions } from "../../Setup/Dimensions"
import {
  isPreloadable, isPreloadableDefinition,
  Preloadable, PreloadableDefinition,
  PreloadableDefinitionObject, PreloadableObject
} from "../Preloadable/Preloadable"

export interface UpdatableDimensionsObject extends PreloadableObject {
}

export interface UpdatableDimensionsDefinitionObject extends PreloadableDefinitionObject {
  width?: number
  height?: number
}

export interface UpdatableDimensions extends Preloadable {}
export const isUpdatableDimensions = (value?: any): value is UpdatableDimensions => {
  return isPreloadable(value)
}
export function assertUpdatableDimensions(value?: any): asserts value is UpdatableDimensions {
  if (!isUpdatableDimensions(value)) throw new Error('expected UpdatableDimensions')
}

export interface UpdatableDimensionsDefinition extends PreloadableDefinition {
  width: number
  height: number
  coverDimensions(dimensions: Dimensions): Dimensions
}
export const isUpdatableDimensionsDefinition = (value?: any): value is UpdatableDimensionsDefinition => {
  return isPreloadableDefinition(value) && "coverDimensions" in value
}
export function assertUpdatableDimensionsDefinition(value?: any): asserts value is UpdatableDimensionsDefinition {
  if (!isUpdatableDimensionsDefinition(value)) throw new Error('expected UpdatableDimensionsDefinition')
}

export type UpdatableDimensionsClass = Constrained<UpdatableDimensions>
export type UpdatableDimensionsDefinitionClass = Constrained<UpdatableDimensionsDefinition>

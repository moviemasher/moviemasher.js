import { Constrained } from "../../declarations"
import { throwError } from "../../Utility/Throw"
import { Size } from "../../Utility/Size"
import {
  isPreloadable, isPreloadableDefinition,
  Preloadable, PreloadableDefinition,
  PreloadableDefinitionObject, PreloadableObject
} from "../Preloadable/Preloadable"

export interface UpdatableSizeObject extends PreloadableObject {
}

export interface UpdatableSizeDefinitionObject extends PreloadableDefinitionObject {
  width?: number
  height?: number
}

export interface UpdatableSize extends Preloadable {}
export const isUpdatableSize = (value?: any): value is UpdatableSize => {
  return isPreloadable(value)
}
export function assertUpdatableSize(value?: any): asserts value is UpdatableSize {
  if (!isUpdatableSize(value)) throwError(value, 'UpdatableSize') 
}

export interface UpdatableSizeDefinition extends PreloadableDefinition {
  width: number
  height: number
  coverSize(size: Size): Size
}
export const isUpdatableSizeDefinition = (value?: any): value is UpdatableSizeDefinition => {
  return isPreloadableDefinition(value) && "coverSize" in value
}
export function assertUpdatableSizeDefinition(value?: any): asserts value is UpdatableSizeDefinition {
  if (!isUpdatableSizeDefinition(value)) throwError(value, 'UpdatableSizeDefinition') 
}

export type UpdatableSizeClass = Constrained<UpdatableSize>
export type UpdatableSizeDefinitionClass = Constrained<UpdatableSizeDefinition>

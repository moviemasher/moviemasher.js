import { Constrained } from "../../declarations"
import { throwError } from "../../Utility/Throw"
import { Size } from "../../Utility/Size"
import {
  isPreloadable, isPreloadableDefinition,
  Preloadable, PreloadableDefinition,
  PreloadableDefinitionObject, PreloadableObject
} from "../Preloadable/Preloadable"
import { DefinitionType, isDefinitionType } from "../../Setup/Enums"

export const UpdatableSizeDefinitionType = [
  DefinitionType.Image,
  DefinitionType.Video,
  DefinitionType.VideoSequence,
]
export interface UpdatableSizeObject extends PreloadableObject {
}

export interface UpdatableSizeDefinitionObject extends PreloadableDefinitionObject {
  sourceSize?: Size
  previewSize?: Size
}

export interface UpdatableSize extends Preloadable {}
export const isUpdatableSize = (value?: any): value is UpdatableSize => {
  return isPreloadable(value)
}
export function assertUpdatableSize(value?: any): asserts value is UpdatableSize {
  if (!isUpdatableSize(value)) throwError(value, 'UpdatableSize') 
}

export const isUpdatableSizeType = (value: any): value is DefinitionType => {
  return isDefinitionType(value) && UpdatableSizeDefinitionType.includes(value)
}

export interface UpdatableSizeDefinition extends PreloadableDefinition {
  previewSize?: Size
  sourceSize?: Size
}
export const isUpdatableSizeDefinition = (value?: any): value is UpdatableSizeDefinition => {
  return isPreloadableDefinition(value)
}
export function assertUpdatableSizeDefinition(value?: any): asserts value is UpdatableSizeDefinition {
  if (!isUpdatableSizeDefinition(value)) throwError(value, 'UpdatableSizeDefinition') 
}

export type UpdatableSizeClass = Constrained<UpdatableSize>
export type UpdatableSizeDefinitionClass = Constrained<UpdatableSizeDefinition>

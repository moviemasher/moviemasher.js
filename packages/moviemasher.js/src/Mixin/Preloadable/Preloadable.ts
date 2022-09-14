import { Constrained} from "../../declarations"
import { LoadType } from "../../Setup/Enums"
import { Content, ContentDefinition, ContentDefinitionObject, ContentObject, isContent, isContentDefinition } from "../../Content/Content"

export interface PreloadableObject extends ContentObject {}

export interface PreloadableDefinitionObject extends ContentDefinitionObject {
  source?: string
  bytes?: number
  mimeType?: string
  url?: string
}

export interface PreloadableDefinition extends ContentDefinition {
  loadType: LoadType
  source: string
  url: string
  bytes: number
  mimeType: string
}
export const isPreloadableDefinition = (value?: any): value is PreloadableDefinition => {
  return isContentDefinition(value) && "loadType" in value 
}

export function assertPreloadableDefinition(value?: any): asserts value is PreloadableDefinition {
  if (!isPreloadableDefinition(value)) throw new Error('expected PreloadableDefinition')
}

export interface Preloadable extends Content {}
export const isPreloadable = (value?: any): value is Preloadable => {
  return isContent(value) && isPreloadableDefinition(value.definition)
}
export function assertPreloadable(value?: any): asserts value is Preloadable {
  if (!isPreloadable(value)) throw new Error('expected Preloadable')
}

export type PreloadableClass = Constrained<Preloadable>
export type PreloadableDefinitionClass = Constrained<PreloadableDefinition>

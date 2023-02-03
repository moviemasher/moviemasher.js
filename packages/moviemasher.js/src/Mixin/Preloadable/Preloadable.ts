import { Constrained} from "../../declarations"
import { LoadType } from "../../Setup/Enums"
import { Content, ContentDefinition, ContentDefinitionObject, ContentObject, isContent, isContentDefinition } from "../../Media/Content/Content"
import { CommandProbeData } from "../../Loader/Loader"
import { Media, MediaObject } from "../../Media/Media"
import { isObject, isPopulatedString } from "../../Utility/Is"
import { MediaInstanceObject } from "../../Media/MediaInstance/MediaInstance"
import { errorsThrow } from "../../Utility/Errors"

export interface PreloadableObject extends MediaInstanceObject, ContentObject {}

export interface PreloadableDefinitionObject extends MediaObject, ContentDefinitionObject {
  bytes?: number
  mimeType?: string
  source?: string
  url?: string
}
export const isPreloadableDefinitionObject = (value: any): value is PreloadableDefinitionObject=> {
  return isObject(value) && isPopulatedString(value.source || value.url)
}

export interface PreloadableDefinition extends ContentDefinition {
  loadType: LoadType
  source: string
  url: string
  bytes: number
  mimeType: string
  info?: CommandProbeData
}
export const isPreloadableDefinition = (value?: any): value is PreloadableDefinition => {
  return isContentDefinition(value) && "loadType" in value 
}

export function assertPreloadableDefinition(value?: any): asserts value is PreloadableDefinition {
  if (!isPreloadableDefinition(value)) errorsThrow(value, 'PreloadableDefinition') 
}

export interface Preloadable extends Content {}
export const isPreloadable = (value?: any): value is Preloadable => {
  return isContent(value) && isPreloadableDefinition(value.definition)
}
export function assertPreloadable(value?: any): asserts value is Preloadable {
  if (!isPreloadable(value)) errorsThrow(value, 'Preloadable') 
}

export type PreloadableClass = Constrained<Preloadable>
export type PreloadableDefinitionClass = Constrained<PreloadableDefinition>

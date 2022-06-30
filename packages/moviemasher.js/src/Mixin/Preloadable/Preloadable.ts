import { Constrained} from "../../declarations"
import { GraphFileArgs, GraphFiles } from "../../MoveMe"
import { LoadType } from "../../Setup/Enums"
import { Content, ContentDefinition, ContentDefinitionObject, ContentObject, isContent, isContentDefinition } from "../../Content/Content"

export interface PreloadableObject extends ContentObject {
}

export interface PreloadableDefinitionObject extends ContentDefinitionObject {
  source?: string
  url?: string
}

export interface Preloadable extends Content { 
}
export const isPreloadable = (value?: any): value is Preloadable => {
  return isContentDefinition(value.definition)
}
export function assertPreloadable(value?: any): asserts value is Preloadable {
  if (!isPreloadable(value)) throw new Error('expected Preloadable')
}

export interface PreloadableDefinition extends ContentDefinition {
  loadType: LoadType
  preloadableSource(editing?: boolean): string
  graphFiles(args: GraphFileArgs): GraphFiles
  source: string
  url: string
  urlAbsolute: string
}
export const isPreloadableDefinition = (value?: any): value is PreloadableDefinition => {
  return isContentDefinition(value) && "preloadableSource" in value
}

export function assertPreloadableDefinition(value?: any): asserts value is PreloadableDefinition {
  if (!isPreloadableDefinition(value)) throw new Error('expected PreloadableDefinition')
}

export type PreloadableClass = Constrained<Preloadable>
export type PreloadableDefinitionClass = Constrained<PreloadableDefinition>

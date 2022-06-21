import {
  Constrained, SvgContent
} from "../../declarations"
import { Dimensions } from "../../Setup/Dimensions"
import { GraphFileArgs, GraphFiles } from "../../MoveMe"
import { LoadType } from "../../Setup/Enums"
import { Definition, DefinitionObject, isDefinition } from "../../Definition/Definition"
import { Instance, InstanceObject, isInstance } from "../../Instance/Instance"
import { TrackPreview } from "../../Editor/Preview/TrackPreview/TrackPreview"

export interface PreloadableObject extends InstanceObject {
}

export interface PreloadableDefinitionObject extends DefinitionObject {
  source?: string
  url?: string
}

export interface Preloadable extends Instance { }
export const isPreloadable = (value?: any): value is Preloadable => {
  return isInstance(value) && "source" in value || "url" in value
}
export function assertPreloadable(value?: any): asserts value is Preloadable {
  if (!isPreloadable(value)) throw new Error('expected Preloadable')
}

export interface PreloadableDefinition extends Definition {
  loadType: LoadType
  preloadableSource(editing?: boolean): string
  graphFiles(args: GraphFileArgs): GraphFiles
  svgContent(filterChain: TrackPreview, dimensions?: Dimensions): SvgContent
  source: string
  url: string
}
export const isPreloadableDefinition = (value?: any): value is PreloadableDefinition => {
  return isDefinition(value) && "preloadableSource" in value
}

export function assertPreloadableDefinition(value?: any): asserts value is PreloadableDefinition {
  if (!isPreloadableDefinition(value)) throw new Error('expected PreloadableDefinition')
}

export type PreloadableClass = Constrained<Preloadable>
export type PreloadableDefinitionClass = Constrained<PreloadableDefinition>

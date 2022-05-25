import { Constrained, FilesArgs, GraphFiles } from "../../declarations"
import { TrackType } from "../../Setup/Enums"
import { Time } from "../../Helpers/Time/Time"
import { TimeRange } from "../../Helpers/Time/Time"
import { Definition, DefinitionObject } from "../../Base/Definition"
import { Instance, InstanceObject, isInstance } from "../../Base/Instance"
import { FilterChain } from "../../Edited/Mash/FilterChain/FilterChain"
import { Preloader } from "../../Preloader/Preloader"
import { imageInstance } from "../../Media"

export interface ClipDefinitionObject extends DefinitionObject {}

export interface ClipDefinition extends Definition {
  audible: boolean
  duration: number
  frames(quantize:number): number
  streamable : boolean
  visible : boolean
}

export interface ClipObject extends InstanceObject {
  frame? : number
  frames? : number
  track? : number
}

export interface Clip extends Instance {
  audible: boolean
  definition: ClipDefinition
  endFrame : number
  frame : number
  frames: number
  filterChainInitialize(args: FilterChain): void
  filterChainPopulate(args: FilterChain): void
  iconUrl(preloader: Preloader): string | undefined
  maxFrames(quantize : number, trim? : number) : number
  time(quantize : number) : Time
  timeRange(quantize : number) : TimeRange
  timeRangeRelative(mashTime : TimeRange, quantize : number) : TimeRange
  track : number
  trackType: TrackType
  transformable: boolean
  visible : boolean
}

export type Clips = Clip[]

export type ClipClass = Constrained<Clip>
export type ClipDefinitionClass = Constrained<ClipDefinition>

export const isClip = (value?: any): value is Clip => {
  return isInstance(value) && "audible" in value || "visible" in value
}

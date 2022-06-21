import { Constrained, ValueObject } from "../../declarations"
import { GraphFileArgs, GraphFiles } from "../../MoveMe"
import { Phase, TrackType } from "../../Setup/Enums"
import { Time } from "../../Helpers/Time/Time"
import { TimeRange } from "../../Helpers/Time/Time"
import { Definition, DefinitionObject } from "../../Definition/Definition"
import { Instance, InstanceObject, isInstance, isInstanceObject } from "../../Instance/Instance"
import { FilterChain } from "../../Edited/Mash/FilterChain/FilterChain"
import { Loader } from "../../Loader/Loader"
import { ChainLinks, FilterChainPhase, ServerFilters } from "../../Filter/Filter"
import { Track } from "../../Edited/Mash/Track/Track"

export interface ClipDefinitionObject extends DefinitionObject {}

export interface ClipDefinition extends Definition {
  audible: boolean
  duration: number

  // instanceFromObject(object?: InstanceObject): Clip
  streamable : boolean
  visible: boolean
  trackType: TrackType
}

export interface ClipObject extends InstanceObject {
  frame? : number
  frames? : number
  track? : number
}
export const isClipObject = isInstanceObject

export interface Clip extends Instance {
  audible: boolean
  chainLinks(): ChainLinks
  definition: ClipDefinition
  effectable: boolean
  endFrame: number
  filterChainPhase(filterChain: FilterChain, phase: Phase): FilterChainPhase | undefined
  filterChainServerFilters(filterChain: FilterChain, values: ValueObject): ServerFilters
  frame : number
  frames: number
  graphFiles(args: GraphFileArgs): GraphFiles
  iconUrl(preloader: Loader): string | undefined
  maxFrames(quantize : number, trim? : number) : number
  time(quantize : number) : Time
  timeRange(quantize : number) : TimeRange
  timeRangeRelative(mashTime : TimeRange, quantize : number) : TimeRange
  track: number
  trackInstance?: Track
  trackType: TrackType
  visible : boolean
}
export const isClip = (value?: any): value is Clip => {
  return isInstance(value) && "trackType" in value
}


export type Clips = Clip[]

export type ClipClass = Constrained<Clip>
export type ClipDefinitionClass = Constrained<ClipDefinition>

import { Constrained } from "../../declarations"
import { GraphFileArgs, GraphFiles } from "../../MoveMe"
import { TrackType } from "../../Setup/Enums"
import { Time } from "../../Helpers/Time/Time"
import { TimeRange } from "../../Helpers/Time/Time"
import { Definition, DefinitionObject } from "../../Definition/Definition"
import { Instance, InstanceObject, isInstance, isInstanceObject } from "../../Instance/Instance"
import { Loader } from "../../Loader/Loader"
import { Track } from "../../Edited/Mash/Track/Track"

export interface ClipDefinitionObject extends DefinitionObject {}

export interface ClipDefinition extends Definition {
  audible: boolean
  duration: number
  streamable : boolean
  trackType: TrackType
  visible: boolean
}

export interface ClipObject extends InstanceObject {
  frame? : number
  frames? : number
  track? : number
}
export const isClipObject = isInstanceObject

export interface Clip extends Instance {
  clipGraphFiles(args: GraphFileArgs): GraphFiles
  definition: ClipDefinition
  effectable: boolean
  endFrame: number
  frame : number
  frames: number
  iconUrl(preloader: Loader): string | undefined
  maxFrames(quantize : number, trim? : number) : number
  time(quantize : number) : Time
  timeRange(quantize : number) : TimeRange
  timeRangeRelative(mashTime : TimeRange, quantize : number) : TimeRange
  track: number
  trackInstance?: Track
  trackType: TrackType
}
export const isClip = (value?: any): value is Clip => {
  return isInstance(value) && "trackType" in value
}

export type Clips = Clip[]

export type ClipClass = Constrained<Clip>
export type ClipDefinitionClass = Constrained<ClipDefinition>

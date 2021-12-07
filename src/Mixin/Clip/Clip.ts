import { ClipState, Constrained, InputCommand, LoadPromise, Size } from "../../declarations"
import { TrackType } from "../../Setup/Enums"
import { Time } from "../../Utilities/Time"
import { TimeRange } from "../../Utilities/TimeRange"
import { Definition, DefinitionObject } from "../../Base/Definition"
import { Instance, InstanceObject } from "../../Base/Instance"

interface ClipDefinitionObject extends DefinitionObject {}

interface ClipDefinition extends Definition {
  audible: boolean
  duration: number
  frames(quantize:number): number
  inputSource: string
  streamable : boolean
  visible : boolean
}

interface ClipObject extends InstanceObject {
  frame? : number
  frames? : number
  track? : number
}

interface Clip extends Instance {
  audible: boolean
  clipState(quantize: number, time: Time, dimensions: Size): ClipState
  clipUrls(quantize : number, start : Time, end? : Time) : string[]
  commandAtTimeToSize(time: Time, quantize: number, dimensions: Size): InputCommand | undefined
  definition: ClipDefinition
  endFrame : number
  frame : number
  frames: number
  inputCommandAtTimeToSize(time : Time, quantize: number, dimensions : Size) : InputCommand | undefined
  loadClip(quantize : number, start : Time, end? : Time) : LoadPromise | void
  maxFrames(quantize : number, trim? : number) : number
  time(quantize : number) : Time
  timeRange(quantize : number) : TimeRange
  timeRangeRelative(mashTime : Time, quantize : number) : TimeRange
  track : number
  trackType : TrackType
  visible : boolean
}

type ClipClass = Constrained<Clip>
type ClipDefinitionClass = Constrained<ClipDefinition>

export {
  Clip, ClipClass, ClipDefinition, ClipDefinitionClass, ClipDefinitionObject, ClipObject
}

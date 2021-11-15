import { Constrained, LoadPromise } from "../../../declarations"
import { TrackType } from "../../../Setup/Enums"
import { Time } from "../../../Utilities/Time"
import { TimeRange } from "../../../Utilities/TimeRange"
import { Definition, DefinitionObject } from "../../Definition/Definition"
import { Instance, InstanceObject } from "../../Instance/Instance"

interface ClipObject extends InstanceObject {
  frame? : number
  frames? : number
  track? : number
}

interface Clip extends Instance {
  audible: boolean
  clipUrls(quantize : number, start : Time, end? : Time) : string[]
  definition: ClipDefinition
  endFrame : number
  frame : number
  frames: number
  loadClip(quantize : number, start : Time, end? : Time) : LoadPromise | void
  maxFrames(quantize : number, trim? : number) : number
  time(quantize : number) : Time
  timeRange(quantize : number) : TimeRange
  timeRangeRelative(mashTime : Time, quantize : number) : TimeRange
  track : number
  trackType : TrackType
  visible : boolean
}

interface ClipDefinitionObject extends DefinitionObject {}

interface ClipDefinition extends Definition {
  visible : boolean
  audible : boolean
  streamable : boolean
  duration: number
  frames(quantize:number): number
}

type ClipClass = Constrained<Clip>
type ClipDefinitionClass = Constrained<ClipDefinition>

export {
  Clip, ClipClass, ClipDefinition, ClipDefinitionClass, ClipDefinitionObject, ClipObject
}

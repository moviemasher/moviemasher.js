import { Any } from "../../../Setup/declarations"
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
  audible : boolean
  endFrame : number
  frame : number
  frames : number
  maxFrames(quantize : number, trim? : number) : number
  mediaTime(time : Time) : Time
  mediaTimeRange(timeRange : TimeRange) : TimeRange
  time(quantize : number) : Time
  timeRange(quantize : number) : TimeRange
  timeRangeRelative(mashTime : Time, quantize : number) : TimeRange
  track : number
  trackType : TrackType
  visible : boolean
}

interface ClipDefinitionObject extends DefinitionObject {

}

interface ClipDefinition extends Definition {
  visible : boolean
  audible : boolean
  duration : number
}


export { Clip, ClipDefinition, ClipDefinitionObject, ClipObject }

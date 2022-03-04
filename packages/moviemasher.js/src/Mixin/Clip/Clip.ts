import { Constrained, FilesArgs, FilterChain, FilterChainArgs, FilterChains, GraphFile, GraphFiles, LoadPromise } from "../../declarations"
import { TrackType } from "../../Setup/Enums"
import { Time } from "../../Helpers/Time"
import { TimeRange } from "../../Helpers/TimeRange"
import { Definition, DefinitionObject } from "../../Base/Definition"
import { Instance, InstanceObject } from "../../Base/Instance"

interface ClipDefinitionObject extends DefinitionObject {}

interface ClipDefinition extends Definition {
  audible: boolean
  duration: number
  frames(quantize:number): number
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
  definition: ClipDefinition
  endFrame : number
  frame : number
  frames: number
  files(filesArgs: FilesArgs): GraphFiles
  filterChain(args: FilterChainArgs) : FilterChain
  filterChainBase(args: FilterChainArgs): FilterChain
  maxFrames(quantize : number, trim? : number) : number
  time(quantize : number) : Time
  timeRange(quantize : number) : TimeRange
  timeRangeRelative(mashTime : Time, quantize : number) : TimeRange
  track : number
  trackType : TrackType
  visible : boolean
}

export type Clips = Clip[]

type ClipClass = Constrained<Clip>
type ClipDefinitionClass = Constrained<ClipDefinition>

export {
  Clip, ClipClass, ClipDefinition, ClipDefinitionClass, ClipDefinitionObject, ClipObject
}

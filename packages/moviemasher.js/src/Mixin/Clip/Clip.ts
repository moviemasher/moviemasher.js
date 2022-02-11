import { Constrained, FilesArgs, FilterChain, FilterChainArgs, GraphFile, LoadPromise } from "../../declarations"
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
  clipUrls(quantize : number, start : Time, end? : Time) : string[]
  definition: ClipDefinition
  endFrame : number
  frame : number
  frames: number
  files(filesArgs: FilesArgs): GraphFile[]
  filterChain(args: FilterChainArgs) : FilterChain | undefined
  filterChainBase(args: FilterChainArgs): FilterChain | undefined
  filterChains(args: FilterChainArgs): FilterChain[]
  // loadClip(quantize : number, start : Time, end? : Time) : LoadPromise | void
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

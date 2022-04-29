import { Constrained, FilesArgs, GraphFiles } from "../../declarations"
import { TrackType } from "../../Setup/Enums"
import { Time } from "../../Helpers/Time/Time"
import { TimeRange } from "../../Helpers/Time/Time"
import { Definition, DefinitionObject } from "../../Base/Definition"
import { Instance, InstanceObject } from "../../Base/Instance"
import { FilterChain } from "../../Edited/Mash/FilterChain/FilterChain"
import { Preloader } from "../../Preloader/Preloader"

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
  clipFiles(filesArgs: FilesArgs): GraphFiles
  filterChain(args: FilterChain): void
  iconUrl(preloader: Preloader): string | undefined
  initializeFilterChain(args: FilterChain): void
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

type ClipClass = Constrained<Clip>
type ClipDefinitionClass = Constrained<ClipDefinition>

export {
  Clip, ClipClass, ClipDefinition, ClipDefinitionClass, ClipDefinitionObject, ClipObject
}

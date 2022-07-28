import { Container, ContainerObject } from "../../Container/Container"
import { Content, ContentObject } from "../../Content/Content"
import { GenericFactory, SvgFilters } from "../../declarations"
import { Rect } from "../../Utility/Rect"
import { CommandFileArgs, CommandFiles, CommandFilterArgs, CommandFilters, GraphFileArgs, GraphFiles } from "../../MoveMe"
import { TrackType } from "../../Setup/Enums"
import { throwError } from "../../Utility/Is"
import { Size } from "../../Utility/Size"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { EffectObject, Effects } from "../Effect/Effect"
import { Track } from "../../Edited/Mash/Track/Track"
import { Definition, DefinitionObject } from "../../Definition/Definition"
import { Instance, InstanceObject, isInstance, isInstanceObject } from "../../Instance/Instance"
import { Loader } from "../../Loader/Loader"

export interface ClipObject extends InstanceObject {
  containerId?: string
  contentId?: string
  content?: ContentObject
  container?: ContainerObject
  frame? : number
  frames? : number
}
export const isClipObject = (value: any): value is ClipObject => {
  return isInstanceObject(value) 
}

export interface ClipDefinitionObject extends DefinitionObject {}

export interface Clip extends Instance {
  
  // definition: ClipDefinition
  audible: boolean
  clipGraphFiles(args: GraphFileArgs): GraphFiles
  commandFiles(args: CommandFileArgs): CommandFiles 
  commandFilters(args: CommandFilterArgs): CommandFilters 
  container?: Container
  containerId: string
  content: Content
  contentId: string
  definition: ClipDefinition
  endFrame: number
  frame : number
  frames: number
  iconUrl(preloader: Loader): string | undefined
  maxFrames(quantize : number, trim? : number) : number
  mutable: boolean
  muted: boolean
  notMuted: boolean
  time(quantize : number) : Time
  timeRange(quantize : number) : TimeRange
  timeRangeRelative(mashTime : TimeRange, quantize : number) : TimeRange
  track: Track
  trackNumber: number
  trackType: TrackType
  visible : boolean
}

export const isClip = (value: any): value is Clip => {
  return isInstance(value) && "containerId" in value
}
export function assertClip(value: any, name?: string): asserts value is Clip {
  if (!isClip(value)) throwError(value, "Clip", name)
}

export type Clips = Clip[]

export interface ClipDefinition extends Definition {
  instanceFromObject(object?: ClipObject): Clip
  audible: boolean
  duration: number
  streamable : boolean
  trackType: TrackType
  visible: boolean
}

/**
 * @category Factory
 */
export interface ClipFactory extends GenericFactory<Clip, ClipObject, ClipDefinition, ClipDefinitionObject> {}

import { Container, ContainerObject, ContainerRectArgs } from "../../../../Container/Container"
import { Content, ContentObject } from "../../../../Content/Content"
import { GenericFactory, SvgOrImage, SvgItemsTuple, EventHandler } from "../../../../declarations"
import { CommandFileArgs, CommandFiles, CommandFilterArgs, CommandFilters, GraphFileArgs, GraphFiles } from "../../../../MoveMe"
import { Sizing, Timing } from "../../../../Setup/Enums"
import { throwError } from "../../../../Utility/Throw"
import { Time, TimeRange } from "../../../../Helpers/Time/Time"
import { Track } from "../../../../Edited/Mash/Track/Track"
import { Definition, DefinitionObject } from "../../../../Definition/Definition"
import { Instance, InstanceObject, isInstance, isInstanceObject } from "../../../../Instance/Instance"
import { Selectable } from "../../../../Editor/Selectable"
import { Tweenable } from "../../../../Mixin/Tweenable/Tweenable"
import { Size } from "../../../../Utility/Size"
import { RectTuple } from "../../../../Utility/Rect"

export interface ClipObject extends InstanceObject {
  containerId?: string
  contentId?: string
  content?: ContentObject
  container?: ContainerObject
  frame? : number
  timing?: string
  sizing?: string
  frames? : number
}
export const isClipObject = (value: any): value is ClipObject => {
  return isInstanceObject(value) 
}
export interface IntrinsicOptions {
  editing?: boolean
  size?: boolean
  duration?: boolean
}


export interface ClipDefinitionObject extends DefinitionObject {}

export interface Clip extends Instance, Selectable {
  audible: boolean
  clipGraphFiles(args: GraphFileArgs): GraphFiles
  clipIcon(size: Size, scale: number, spacing?: number, color?: string): Promise<SvgOrImage> | undefined
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
  intrinsicsKnown(options: IntrinsicOptions): boolean
  intrinsicGraphFiles(options: IntrinsicOptions): GraphFiles
  maxFrames(quantize : number, trim? : number) : number
  mutable: boolean
  muted: boolean
  notMuted: boolean
  rects(args: ContainerRectArgs): RectTuple
  resetDuration(tweenable?: Tweenable, quantize?: number): void
  sizing: Sizing
  previewItemsPromise(size: Size, time?: Time, icon?: boolean): Promise<SvgItemsTuple>
  time(quantize : number) : Time
  timeRange(quantize : number) : TimeRange
  timeRangeRelative(mashTime : TimeRange, quantize : number) : TimeRange
  timing: Timing
  track: Track
  trackNumber: number
  visible : boolean
}

export const isClip = (value: any): value is Clip => {
  return isInstance(value) && "contentId" in value
}
export function assertClip(value: any, name?: string): asserts value is Clip {
  if (!isClip(value)) throwError(value, "Clip", name)
}

export type Clips = Clip[]

export interface ClipDefinition extends Definition {
  instanceFromObject(object?: ClipObject): Clip
  audible: boolean
  // duration: number
  streamable : boolean
  visible: boolean
}

/**
 * @category Factory
 */
export interface ClipFactory extends GenericFactory<Clip, ClipObject, ClipDefinition, ClipDefinitionObject> {}

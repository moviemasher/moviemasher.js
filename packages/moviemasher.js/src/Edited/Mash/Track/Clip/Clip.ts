import { Container, ContainerObject, ContainerRectArgs } from "../../../../Media/Container/Container"
import { Content, ContentObject } from "../../../../Media/Content/Content"
import { SvgOrImage, PreviewItems, UnknownObject } from "../../../../declarations"
import { CommandFileArgs, CommandFiles, CommandFilterArgs, CommandFilters, PreloadArgs, GraphFiles, Component, ServerPromiseArgs } from "../../../../MoveMe"
import { Sizing, Timing } from "../../../../Setup/Enums"
import { errorsThrow } from "../../../../Utility/Errors"
import { Time, TimeRange } from "../../../../Helpers/Time/Time"
import { Track } from "../../../../Edited/Mash/Track/Track"
import { Selectable } from "../../../../Editor/Selectable"
import { Tweenable } from "../../../../Mixin/Tweenable/Tweenable"
import { Size } from "../../../../Utility/Size"
import { RectTuple } from "../../../../Utility/Rect"
import { Property } from "../../../../Setup/Property"
import { Propertied } from "../../../../Base/Propertied"
import { isObject } from "../../../../Utility/Is"



export interface ClipObject extends UnknownObject {
  containerId?: string
  contentId?: string
  content?: ContentObject
  container?: ContainerObject
  frame? : number
  timing?: string
  sizing?: string
  frames? : number
  label?: string
}

export const isClipObject = (value: any): value is ClipObject => {
  return isObject(value) 
}
export interface IntrinsicOptions {
  editing?: boolean
  size?: boolean
  duration?: boolean
}


export interface ClipDefinitionObject {}

export interface Clip extends Selectable, Propertied {
  // copy(): Clip
  // definition: Definition
  // definitionId: string
  definitionIds(): string[]
  propertiesCustom: Property[]
  id: string
  label: string
  // propertyNames: string[]
  // type: DefinitionType

  audible: boolean
  clipIcon(size: Size, scale: number, spacing?: number, color?: string): Promise<SvgOrImage> | undefined
  clipCommandFiles(args: CommandFileArgs): CommandFiles 
  commandFilters(args: CommandFilterArgs): CommandFilters 
  container?: Container
  containerId: string
  content: Content
  contentId: string
  // definition: ClipDefinition
  endFrame: number
  frame : number
  frames: number
  intrinsicsKnown(options: IntrinsicOptions): boolean
  intrinsicGraphFiles(options: IntrinsicOptions): GraphFiles
 
  serverPromise(args: ServerPromiseArgs): Promise<void>
  
  loadPromise(args: PreloadArgs): Promise<void>
  maxFrames(quantize : number, trim? : number) : number
  mutable: boolean
  muted: boolean
  notMuted: boolean
  // preloadUrls(args: PreloadArgs): string[]
  rects(args: ContainerRectArgs): RectTuple
  resetTiming(tweenable?: Tweenable, quantize?: number): void
  sizing: Sizing
  previewItemsPromise(size: Size, time: Time, component: Component): Promise<PreviewItems>
  time(quantize : number) : Time
  timeRange(quantize : number) : TimeRange
  timeRangeRelative(mashTime : TimeRange, quantize : number) : TimeRange
  timing: Timing
  track: Track
  trackNumber: number
  visible : boolean
}

export const isClip = (value: any): value is Clip => {
  return isObject(value) && "contentId" in value
}
export function assertClip(value: any, name?: string): asserts value is Clip {
  if (!isClip(value)) errorsThrow(value, "Clip", name)
}

export type Clips = Clip[]

// export interface ClipDefinition extends Definition {
//   instanceFromObject(object?: ClipObject): Clip
//   audible: boolean
//   // duration: number
//   streamable : boolean
//   visible: boolean
// }

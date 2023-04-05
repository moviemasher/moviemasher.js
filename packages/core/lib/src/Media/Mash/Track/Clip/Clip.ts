import { Container, ContainerObject, ContainerRectArgs } from '../../../Container/Container.js'
import { Content, ContentObject } from '../../../Content/Content.js'
import { UnknownRecord } from '../../../../Types/Core.js'
import { SvgOrImage, PreviewItems } from '../../../../Helpers/Svg/Svg.js'
import { CommandFileArgs, CommandFiles, CommandFilterArgs, CommandFilters, PreloadArgs, GraphFiles, Component, ServerPromiseArgs } from '../../../../Base/Code.js'
import { Sizing, Timing } from '../../../../Setup/Enums.js'
import { errorThrow } from '../../../../Helpers/Error/ErrorFunctions.js'
import { Time, TimeRange } from '../../../../Helpers/Time/Time.js'
import { Track } from '../Track.js'
import { Tweenable } from '../../../../Mixin/Tweenable/Tweenable.js'
import { Size } from '../../../../Utility/Size.js'
import { RectTuple } from '../../../../Utility/Rect.js'
import { Propertied } from '../../../../Base/Propertied.js'
import { isObject } from '../../../../Utility/Is.js'
import { Selectable } from '../../../../Plugin/Masher/Selectable.js'


export interface IntrinsicOptions {
  editing?: boolean
  size?: boolean
  duration?: boolean
}

export interface ClipObject extends UnknownRecord {
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

export interface ClipArgs extends ClipObject {
  // track: Track
}
export interface ClipDefinitionObject {}

export interface Clip extends Selectable, Propertied {
  audible: boolean
  clipCommandFiles(args: CommandFileArgs): CommandFiles 
  clipIcon(size: Size, scale: number, spacing?: number, color?: string): Promise<SvgOrImage> | undefined
  commandFilters(args: CommandFilterArgs): CommandFilters 
  container?: Container
  containerId: string
  content: Content
  contentId: string
  definitionIds(): string[]
  endFrame: number
  frame : number
  frames: number
  id: string
  intrinsicGraphFiles(options: IntrinsicOptions): GraphFiles
  intrinsicsKnown(options: IntrinsicOptions): boolean
  label: string
  loadPromise(args: PreloadArgs): Promise<void>
  maxFrames(quantize : number, trim? : number) : number
  mutable: boolean
  muted: boolean
  notMuted: boolean
  previewItemsPromise(size: Size, time: Time, component: Component): Promise<PreviewItems>
  rects(args: ContainerRectArgs): RectTuple
  resetTiming(tweenable?: Tweenable, quantize?: number): void
  serverPromise(args: ServerPromiseArgs): Promise<void>
  sizing: Sizing
  time(quantize : number) : Time
  timeRange(quantize : number) : TimeRange
  timeRangeRelative(mashTime : TimeRange, quantize : number) : TimeRange
  timing: Timing
  track: Track
  trackNumber: number
  visible : boolean
}

export const isClip = (value: any): value is Clip => {
  return isObject(value) && 'contentId' in value
}
export function assertClip(value: any, name?: string): asserts value is Clip {
  if (!isClip(value)) errorThrow(value, 'Clip', name)
}

export type Clips = Clip[]

// export interface ClipDefinition extends Definition {
//   instanceFromObject(object?: ClipObject): Clip
//   audible: boolean
//   // duration: number
//   streamable : boolean
//   visible: boolean
// }

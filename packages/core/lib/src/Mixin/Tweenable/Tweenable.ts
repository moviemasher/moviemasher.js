import type { Scalar} from '../../Types/Core.js'
import type { Constrained } from '../../Base/Constrained.js'
import type { 
  CommandFiles, CommandFilter, CommandFilterArgs, CommandFilters, GraphFile, 
  PreloadArgs, GraphFiles, VisibleCommandFileArgs, VisibleCommandFilterArgs 
} from '../../Base/Code.js'
import type { Filter } from '../../Plugin/Filter/Filter.js'
import type { Time, TimeRange } from '../../Helpers/Time/Time.js'
import type { Clip, IntrinsicOptions } from '../../Media/Mash/Track/Clip/Clip.js'
import type { Orientation } from '../../Setup/Enums.js'
import type { MediaType } from '../../Setup/MediaType.js'
import type { Property } from '../../Setup/Property.js'
import type { PointTuple } from '../../Utility/Point.js'
import type { Rect, RectTuple } from '../../Utility/Rect.js'
import type { SelectedProperties } from '../../Helpers/Select/SelectedProperty.js'
import type { SizeTuple } from '../../Utility/Size.js'
import type { Tweening } from './Tween.js'
import type { Media, MediaInstance, MediaInstanceObject, MediaObject } from '../../Media/Media.js'
import type { Selectable } from '../../Plugin/Masher/Selectable.js'
import type { Actions } from '../../Plugin/Masher/Actions/Actions.js'

export interface TweenableObject extends MediaInstanceObject {
  mediaId?: string
  definition?: Media
  label?: string
  container?: boolean
  x?: number
  xEnd?: number
  y?: number
  yEnd?: number
  lock?: string
}

export interface TweenableDefinitionObject extends MediaObject {
  type?: MediaType | string
}

export interface Tweenable extends MediaInstance, Selectable {
  alphamergeCommandFilters(args: CommandFilterArgs): CommandFilters
  amixCommandFilters(args: CommandFilterArgs): CommandFilters
  canColor(args: CommandFilterArgs): boolean
  canColorTween(args: CommandFilterArgs): boolean
  clip: Clip
  clipped: boolean
  colorBackCommandFilters(args: VisibleCommandFilterArgs, output?: string): CommandFilters
  colorFilter: Filter  
  commandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container?: boolean): CommandFilters 
  container: boolean
  containerColorCommandFilters(args: VisibleCommandFilterArgs): CommandFilters
  containerCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters 
  containerFinalCommandFilters(args: VisibleCommandFilterArgs): CommandFilters 
  contentCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters 
  copyCommandFilter(input: string, track: number, prefix?: string): CommandFilter
  cropFilter: Filter
  definitionTime(masherTime: Time, clipRange: TimeRange): Time
  fileCommandFiles(graphFileArgs: PreloadArgs): CommandFiles
  frames(quantize: number): number 
  graphFiles(args: PreloadArgs): GraphFiles
  hasIntrinsicSizing: boolean
  hasIntrinsicTiming: boolean
  initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container?: boolean): CommandFilters
  intrinsicGraphFile(options: IntrinsicOptions): GraphFile
  intrinsicRect(editing?: boolean): Rect
  intrinsicsKnown(options: IntrinsicOptions): boolean
  isDefault: boolean
  loadPromise(args: PreloadArgs): Promise<void>
  lock: Orientation
  mutable(): boolean
  muted: boolean
  overlayCommandFilters(bottomInput: string, topInput: string, alpha?: boolean): CommandFilters
  overlayFilter: Filter
  scaleCommandFilters(args: CommandFilterArgs): CommandFilters 
  selectedProperties(actions: Actions, property: Property): SelectedProperties
  selectedProperty(property: Property): boolean 
  tween(keyPrefix: string, time: Time, range: TimeRange): Scalar
  tweenPoints(time: Time, range: TimeRange): PointTuple 
  tweenRects(time: Time, range: TimeRange): RectTuple
  tweenSizes(time: Time, range: TimeRange): SizeTuple 
  tweenValues(key: string, time: Time, range: TimeRange): Scalar[] 
  visibleCommandFiles(args: VisibleCommandFileArgs): CommandFiles 
}


export interface TweenableDefinition extends Media {
  graphFiles(args: PreloadArgs): GraphFiles 
  loadPromise(args: PreloadArgs): Promise<void> 
}

export type TweenableClass = Constrained<Tweenable>
export type TweenableDefinitionClass = Constrained<TweenableDefinition>

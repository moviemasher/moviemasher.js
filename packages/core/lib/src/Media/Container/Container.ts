import type { Tweenable, TweenableObject, TweenableDefinitionObject, TweenableDefinition } from '../../Mixin/Tweenable/Tweenable.js'
import type { Constrained } from '../../Base/Constrained.js'
import type { PreviewItems, SvgItem } from '../../Helpers/Svg/Svg.js'
import type { Rect, RectTuple } from '../../Utility/Rect.js'
import type { Size } from '../../Utility/Size.js'
import type { CommandFilters, CommandFilterArgs, Component } from '../../Base/Code.js'
import type { Time, TimeRange } from '../../Helpers/Time/Time.js'
import type { Content } from '../Content/Content.js'
import type { Direction, SideDirectionObject } from '../../Setup/Enums.js'

export interface ContainerObject extends TweenableObject {
  height?: number
  heightEnd?: number
  offN?: boolean
  offS?: boolean
  offE?: boolean
  offW?: boolean
  opacity?: number
  opacityEnd?: number
  width?: number
  widthEnd?: number
}
export interface ContainerDefinitionObject extends TweenableDefinitionObject {}

export interface ContainerDefinition extends TweenableDefinition {

}

export interface ContainerRectArgs {
  size: Size
  time: Time
  timeRange: TimeRange
  loading?: boolean
  editing?: boolean
}

export interface Container extends Tweenable {
  colorizeCommandFilters(args: CommandFilterArgs): CommandFilters 
  colorMaximize: boolean
  containerRects(args: ContainerRectArgs, inRect: Rect): RectTuple
  containerSvgItemPromise(containerRect: Rect, time: Time, range: TimeRange, component: Component): Promise<SvgItem>
  directionObject: SideDirectionObject
  directions: Direction[]
  height: number
  offE: boolean
  offN: boolean
  offS: boolean
  offW: boolean
  opacity: number
  opacityCommandFilters(args: CommandFilterArgs): CommandFilters
  opacityEnd?: number
  pathElement(rect: Rect): SvgItem 
  previewItemsPromise(content: Content, containerRect: Rect, previewSize: Size, time: Time, range: TimeRange, component: Component): Promise<PreviewItems>
  translateCommandFilters(args: CommandFilterArgs): CommandFilters
  width: number
  x: number
  y: number
}

export type ContainerClass = Constrained<Container>

export type ContainerDefinitionClass = Constrained<ContainerDefinition>

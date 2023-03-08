import { Tweenable, TweenableObject, TweenableDefinitionObject, TweenableDefinition } from "../../Mixin/Tweenable/Tweenable"
import { Constrained } from "../../Base/Constrained"
import { PreviewItems, SvgItem } from "../../Helpers/Svg/Svg"
import { Rect, RectTuple } from "../../Utility/Rect"
import { Size } from "../../Utility/Size"
import { CommandFilters, CommandFilterArgs, Component } from "../../Base/Code"
import { Anchor, DirectionObject } from "../../Setup/Enums"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { Content } from "../Content/Content"

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
  // containerSvgFilter(svgItem: SvgItem, previewSize: Size, containerRect: Rect, time: Time, range: TimeRange): SVGFilterElement | undefined
  directionObject: DirectionObject
  directions: Anchor[]
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
  containerSvgItemPromise(containerRect: Rect, time: Time, range: TimeRange, component: Component): Promise<SvgItem>
  translateCommandFilters(args: CommandFilterArgs): CommandFilters
  width: number
  x: number
  y: number
}

export type ContainerClass = Constrained<Container>

export type ContainerDefinitionClass = Constrained<ContainerDefinition>

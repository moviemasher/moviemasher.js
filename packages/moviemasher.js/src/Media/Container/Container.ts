import { Tweenable, TweenableObject, isTweenable, TweenableDefinitionObject, TweenableDefinition, isTweenableDefinition } from "../../Mixin/Tweenable/Tweenable"
import { Constrained, PreviewItems, SvgItem } from "../../declarations"
import { Rect, RectTuple } from "../../Utility/Rect"
import { Size } from "../../Utility/Size"
import { CommandFilters, CommandFilterArgs, Component } from "../../MoveMe"
import { Anchor, DirectionObject, isContainerType } from "../../Setup/Enums"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { isObject } from "../../Utility/Is"
import { errorsThrow } from "../../Utility/Errors"
import { IdPrefix, IdSuffix } from "../../Setup/Constants"
import { Content } from "../Content/Content"

export const DefaultContainerId = `${IdPrefix}container.image${IdSuffix}`
export const TextContainerId = `${IdPrefix}container.image.text`

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
export const isContainerObject = (value: any): value is ContainerObject => {
  return isObject(value) && "opacity" in value
}
export function assertContainerObject(value: any): asserts value is ContainerObject {
  if (!isContainerObject(value)) errorsThrow(value, 'ContainerObject')
}
export interface ContainerDefinitionObject extends TweenableDefinitionObject {}

export interface ContainerDefinition extends TweenableDefinition {

}


export const isContainerDefinition = (value?: any): value is ContainerDefinition => {
  return isTweenableDefinition(value) && isContainerType(value.type)
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
export const isContainer = (value?: any): value is Container => {
  return isTweenable(value) && isContainerType(value.type)
}
export function assertContainer(value?: any): asserts value is Container {
  if (!isContainer(value)) throw new Error('expected Container')
}

export type ContainerClass = Constrained<Container>
export type ContainerDefinitionClass = Constrained<ContainerDefinition>

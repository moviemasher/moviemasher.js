import { Tweenable, TweenableObject, isTweenable, TweenableDefinitionObject, TweenableDefinition, isTweenableDefinition } from "../Mixin/Tweenable/Tweenable"
import { Constrained, GenericFactory, SvgItem } from "../declarations"
import { Rect, RectTuple } from "../Utility/Rect"
import { Size } from "../Utility/Size"
import { CommandFilters, CommandFilterArgs } from "../MoveMe"
import { Anchor, DirectionObject, isContainerType } from "../Setup/Enums"
import { Time, TimeRange } from "../Helpers/Time/Time"
import { isObject } from "../Utility/Is"
import { throwError } from "../Utility/Throw"
import { IdPrefix, IdSuffix } from "../Setup/Constants"

export const DefaultContainerId = `${IdPrefix}container${IdSuffix}`
export const TextContainerId = `${IdPrefix}container.text`

export interface ContainerObject extends TweenableObject {
  height?: number
  heightEnd?: number
  opacity?: number
  opacityEnd?: number
  width?: number
  widthEnd?: number
}
export const isContainerObject = (value: any): value is ContainerObject => {
  return isObject(value) && "opacity" in value
}
export function assertContainerObject(value: any): asserts value is ContainerObject {
  if (!isContainerObject(value)) throwError(value, 'ContainerObject')
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
  containerSvgFilter(svgItem: SvgItem, previewSize: Size, containerRect: Rect, time: Time, range: TimeRange): SVGFilterElement | undefined
  containerPreviewItemPromise(containerRect: Rect, time: Time, range: TimeRange, icon?: boolean): Promise<SvgItem>
  directionObject: DirectionObject
  directions: Anchor[]
  height: number
  opacity: number
  opacityCommandFilters(args: CommandFilterArgs): CommandFilters
  opacityEnd?: number
  pathElement(rect: Rect): SvgItem 
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

/**
 * @category Factory
 */
 export interface ContainerFactory extends GenericFactory<Container, ContainerObject, ContainerDefinition, ContainerDefinitionObject> { }

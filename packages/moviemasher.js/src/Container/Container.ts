import { Tweenable, TweenableObject, isTweenable, TweenableDefinitionObject, TweenableDefinition, isTweenableDefinition } from "../Mixin/Tweenable/Tweenable"
import { Constrained, GenericFactory, SvgContent, SvgFilters } from "../declarations"
import { Rect, RectTuple } from "../Utility/Rect"
import { Size } from "../Utility/Size"
import { CommandFilters, CommandFilterArgs, SelectedProperties, CommandFilter } from "../MoveMe"
import { Actions } from "../Editor/Actions/Actions"
import { Direction, isContainerType, SelectType } from "../Setup/Enums"
import { Time, TimeRange } from "../Helpers/Time/Time"
import { Filter } from "../Filter/Filter"
import { isObject, throwError } from "../Utility/Is"

export interface ContainerObject extends TweenableObject {
  height?: number
  heightEnd?: number
  opacity?: number
  opacityEnd?: number
  width?: number
  widthEnd?: number
  intrinsicWidth?: number
  intrinsicHeight?: number
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

export interface Container extends Tweenable {
  blendFilter: Filter
  colorMaximize: boolean
  colorizeCommandFilters(args: CommandFilterArgs): CommandFilters 
  containerRects(outputSize: Size, time: Time, timeRange: TimeRange, forFiles?: boolean): RectTuple
  containerSvg(rect: Rect, time: Time, range: TimeRange): SvgContent
  containerSvgFilters(previewSize: Size, containerRect: Rect, time: Time, range: TimeRange): SvgFilters
  directions: Direction[]
  height: number
  instrinsicsKnown: boolean
  intrinsicSize(): Size
  intrinsicGroupElement: SVGGElement
  mode: number
  mutable: boolean
  muted: boolean
  opacity: number
  opacityCommandFilters(args: CommandFilterArgs): CommandFilters
  opacityEnd?: number
  pathElement(previewSize: Size, time: Time, range: TimeRange, forecolor?: string): SvgContent 
  selectedProperties(actions: Actions, selectType: SelectType): SelectedProperties
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
import { Tweenable, TweenableObject, isTweenable, TweenableDefinitionObject, TweenableDefinition, isTweenableDefinition } from "../Mixin/Tweenable/Tweenable"
import { Constrained, Rect, SvgContent, SvgFilters } from "../declarations"
import { Dimensions } from "../Setup/Dimensions"
import { CommandFiles, CommandFilters, ContainerCommandFileArgs, ContainerCommandFilterArgs, GraphFileArgs, GraphFiles, SelectedProperties } from "../MoveMe"
import { Actions } from "../Editor/Actions/Actions"
import { Direction, isContainerType, SelectType } from "../Setup/Enums"
import { Time, TimeRange } from "../Helpers/Time/Time"
import { Filter } from "../Filter/Filter"

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
export interface ContainerDefinitionObject extends TweenableDefinitionObject {}

export interface ContainerDefinition extends TweenableDefinition {
}
export const isContainerDefinition = (value?: any): value is ContainerDefinition => {
  return isTweenableDefinition(value) && isContainerType(value.type)
}

export interface Container extends Tweenable {
  containerCommandFiles(args: ContainerCommandFileArgs): CommandFiles 
  containerCommandFilters(args: ContainerCommandFilterArgs): CommandFilters 
  containerRects(outputDimensions: Dimensions, time: Time, timeRange: TimeRange, forFiles?: boolean): Rect[]
  containerSvg(rect: Rect): SvgContent
  containerSvgFilters(previewDimensions: Dimensions, containerRect: Rect, time: Time, range: TimeRange): SvgFilters
  directions: Direction[]
  graphFiles(args: GraphFileArgs): GraphFiles
  blendFilter: Filter
  overlayFilter: Filter
  height: number
  intrinsicDimensions(): Dimensions
  instrinsicsKnown: boolean
  intrinsicGroupElement: SVGGElement
  mode: number
  mutable: boolean
  muted: boolean
  opacity: number
  opacityEnd?: number
  pathElement(previewDimensions: Dimensions, forecolor?: string): SvgContent 
  selectedProperties(actions: Actions, selectType: SelectType): SelectedProperties
  opacityCommandFilters(args: ContainerCommandFilterArgs): CommandFilters
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

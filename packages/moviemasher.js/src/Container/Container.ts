import { Definition, DefinitionObject, isDefinition } from "../Definition/Definition"
import { Instance, InstanceObject, isInstance } from "../Instance/Instance"
import { Constrained, SvgContent, ValueObject } from "../declarations"
import { Dimensions } from "../Setup/Dimensions"
import { Chain, ContainerChainArgs, GraphFileArgs, GraphFiles, SelectedProperties, Transforms } from "../MoveMe"
import { TrackPreview } from "../Editor/Preview/TrackPreview/TrackPreview"
import { Actions } from "../Editor/Actions/Actions"
import { ChainLink, ChainLinker, Filter, FilterDefinition } from "../Filter/Filter"
import { isContainerType, SelectType } from "../Setup/Enums"

export interface ContainerObject extends InstanceObject {
  x?: number
  y?: number
  width?: number
  height?: number
}
export interface ContainerDefinitionObject extends DefinitionObject {}

export interface ContainerDefinition extends Definition {
  overlayFilterDefinition: FilterDefinition
  scaleFilterDefinition: FilterDefinition
  setsarFilterDefinition: FilterDefinition
  blendFilterDefinition: FilterDefinition
  opacityFilterDefinition: FilterDefinition

}
export const isContainerDefinition = (value?: any): value is ContainerDefinition => {
  return isDefinition(value) && isContainerType(value.type)
}

export interface Container extends Instance, ChainLink, ChainLinker {
  x: number
  y: number
  width: number
  height: number
  sizeable: boolean

  opacity: number
  opacityEnd?: number
  mode: number
  
  positionable: boolean
  svgContent(filterChain: TrackPreview, dimensions: Dimensions): SvgContent
  transformSvgContent(filterChain: TrackPreview): SvgContent
  graphFiles(args: GraphFileArgs): GraphFiles
  transforms(filterChain: TrackPreview): Transforms
  intrinsicDimensions(): Dimensions
  containerChain(args: ContainerChainArgs): Chain
  overlayFilter: Filter
  mutable: boolean
  muted: boolean
  selectedProperties(actions: Actions, selectType: SelectType): SelectedProperties
}
export const isContainer = (value?: any): value is Container => {
  return isInstance(value) && isContainerType(value.type)
}

export type ContainerClass = Constrained<Container>
export type ContainerDefinitionClass = Constrained<ContainerDefinition>


export function assertContainer(value?: any): asserts value is Container {
  if (!isContainer(value)) throw new Error('expected Container')
}

import { Constrained, SvgContent } from "../declarations"
import { Dimensions } from "../Setup/Dimensions"
import { Chain, ContentChainArgs, GraphFileArgs, GraphFiles, SelectedProperties } from "../MoveMe"
import { Definition, DefinitionObject } from "../Definition/Definition"
import { Instance, InstanceObject, isInstance } from "../Instance/Instance"
import { ChainLink, ChainLinker } from "../Filter/Filter"
import { TrackPreview } from "../Editor/Preview/TrackPreview/TrackPreview"
import { isContentType, SelectType } from "../Setup/Enums"
import { throwError } from "../Utility/Is"
import { Actions } from "../Editor/Actions/Actions"

export interface ContentObject extends InstanceObject {}

export interface ContentDefinition extends Definition {}

export interface ContentDefinitionObject extends DefinitionObject { }

export interface Content extends Instance, ChainLink, ChainLinker {
  svgContent(filterChain: TrackPreview, dimensions: Dimensions): SvgContent
  graphFiles(args: GraphFileArgs): GraphFiles
  intrinsicDimensions(): Dimensions
  mutable: boolean
  muted: boolean
  contentChain(args: ContentChainArgs): Chain 
  selectedProperties(actions: Actions, selectType: SelectType): SelectedProperties
}

export type ContentClass = Constrained<Content>
export type ContentDefinitionClass = Constrained<ContentDefinition>

export const isContent = (value?: any): value is Content => {
  return isInstance(value) && isContentType(value.type)
}

export function assertContent(value?: any, name?: string): asserts value is Content {
  if (!isContent(value)) throwError(value, 'Content', name)
}

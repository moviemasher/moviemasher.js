import { Constrained,  Rect,  SvgContent } from "../declarations"
import { Dimensions } from "../Setup/Dimensions"
import { CommandFiles, CommandFilters, ContentCommandFileArgs, ContentCommandFilterArgs, GraphFileArgs, GraphFiles, SelectedProperties } from "../MoveMe"
import { isContentType, SelectType } from "../Setup/Enums"
import { throwError } from "../Utility/Is"
import { Actions } from "../Editor/Actions/Actions"
import { isTweenable, isTweenableDefinition, Tweenable, TweenableDefinition, TweenableDefinitionObject, TweenableObject } from "../Mixin/Tweenable/Tweenable"
import { Time, TimeRange } from "../Helpers/Time/Time"

export interface ContentObject extends TweenableObject {
}

export interface ContentDefinitionObject extends TweenableDefinitionObject { }

export interface Content extends Tweenable {
  contentCommandFiles(args: ContentCommandFileArgs): CommandFiles 
  contentCommandFilters(args: ContentCommandFilterArgs): CommandFilters 
  graphFiles(args: GraphFileArgs): GraphFiles
  intrinsicDimensions(): Dimensions
  mutable: boolean
  muted: boolean
  selectedProperties(actions: Actions, selectType: SelectType): SelectedProperties
  contentSvg(containerRect: Rect, time: Time, range: TimeRange): SvgContent
  svgContent(rect: Rect, stretch?: boolean): SvgContent
}
export const isContent = (value?: any): value is Content => {
  return isTweenable(value) && isContentType(value.type)
}
export function assertContent(value?: any, name?: string): asserts value is Content {
  if (!isContent(value)) throwError(value, 'Content', name)
}

export interface ContentDefinition extends TweenableDefinition {}
export const isContentDefinition = (value?: any): value is ContentDefinition => {
  return isTweenableDefinition(value) && isContentType(value.type)
}

export type ContentClass = Constrained<Content>
export type ContentDefinitionClass = Constrained<ContentDefinition>


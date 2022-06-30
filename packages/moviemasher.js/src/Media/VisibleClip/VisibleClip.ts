import { Container, ContainerObject } from "../../Container/Container"
import { Content, ContentObject } from "../../Content/Content"
import { GenericFactory, Rect, SvgFilters } from "../../declarations"
import { CommandFileArgs, CommandFiles, CommandFilterArgs, CommandFilters, SelectedProperties } from "../../MoveMe"
import { Actions } from "../../Editor/Actions/Actions"
import { isClip } from "../../Mixin/Clip/Clip"
import {
  Visible, VisibleDefinition, VisibleDefinitionObject, VisibleObject
} from "../../Mixin/Visible/Visible"
import { SelectType } from "../../Setup/Enums"
import { throwError } from "../../Utility/Is"
import { Dimensions } from "../../Setup/Dimensions"
import { Time, TimeRange } from "../../Helpers/Time/Time"

export interface VisibleClipObject extends VisibleObject {
  containerId?: string
  contentId?: string
  content?: ContentObject
  container?: ContainerObject
}

export interface VisibleClipDefinitionObject extends VisibleDefinitionObject {}

export interface VisibleClip extends Visible {
  definition: VisibleClipDefinition
  containerId: string
  contentId: string
  container?: Container
  content: Content
  mutable: boolean
  muted: boolean
  notMuted: boolean
  commandFiles(args: CommandFileArgs): CommandFiles 
  commandFilters(args: CommandFilterArgs): CommandFilters 
  selectedProperties(actions: Actions, selectTypes?: SelectType[]): SelectedProperties
  svgFilters(previewDimensions: Dimensions, containerRect: Rect, time: Time, range: TimeRange): SvgFilters
}

export const isVisibleClip = (value: any): value is VisibleClip => {
  return isClip(value) && "containerId" in value
}
export function assertVisibleClip(value: any, name?: string): asserts value is VisibleClip {
  if (!isVisibleClip(value)) throwError(value, "VisibleClip", name)
}

export interface VisibleClipDefinition extends VisibleDefinition {
  instanceFromObject(object?: VisibleClipObject): VisibleClip
}

/**
 * @category Factory
 */
export interface VisibleClipFactory extends GenericFactory<VisibleClip, VisibleClipObject, VisibleClipDefinition, VisibleClipDefinitionObject> {}

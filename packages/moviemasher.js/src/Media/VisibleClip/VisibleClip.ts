import { Container, ContainerObject } from "../../Container/Container"
import { Content, ContentObject } from "../../Content/Content"
import { GenericFactory, SvgFilters } from "../../declarations"
import { Rect } from "../../Utility/Rect"
import { CommandFileArgs, CommandFiles, CommandFilterArgs, CommandFilters, SelectedProperties } from "../../MoveMe"
import { Actions } from "../../Editor/Actions/Actions"
import { Clip, ClipDefinition, ClipDefinitionObject, ClipObject, isClip } from "../../Mixin/Clip/Clip"
import { SelectType } from "../../Setup/Enums"
import { throwError } from "../../Utility/Is"
import { Size } from "../../Utility/Size"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { EffectObject, Effects } from "../Effect/Effect"

export interface VisibleClipObject extends ClipObject {
  containerId?: string
  contentId?: string
  content?: ContentObject
  container?: ContainerObject
  effects?: EffectObject[]
}

export interface VisibleClipDefinitionObject extends ClipDefinitionObject {}

export interface VisibleClip extends Clip {

  audible: boolean
  visible : boolean
  
  commandFiles(args: CommandFileArgs): CommandFiles 
  commandFilters(args: CommandFilterArgs): CommandFilters 
  container?: Container
  containerId: string
  content: Content
  contentId: string
  definition: VisibleClipDefinition
  effects: Effects
  mutable: boolean
  muted: boolean
  notMuted: boolean
  selectedProperties(actions: Actions, selectTypes?: SelectType[]): SelectedProperties
  svgFilters(previewSize: Size, containerRect: Rect, time: Time, range: TimeRange): SvgFilters
}

export const isVisibleClip = (value: any): value is VisibleClip => {
  return isClip(value) && "containerId" in value
}
export function assertVisibleClip(value: any, name?: string): asserts value is VisibleClip {
  if (!isVisibleClip(value)) throwError(value, "VisibleClip", name)
}

export interface VisibleClipDefinition extends ClipDefinition {
  instanceFromObject(object?: VisibleClipObject): VisibleClip
}

/**
 * @category Factory
 */
export interface VisibleClipFactory extends GenericFactory<VisibleClip, VisibleClipObject, VisibleClipDefinition, VisibleClipDefinitionObject> {}

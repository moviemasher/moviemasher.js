import { Container, ContainerObject } from "../../Container/Container"
import { Content, ContentObject } from "../../Content/Content"
import { GenericFactory, SvgFilters } from "../../declarations"
import { Rect } from "../../Utility/Rect"
import { CommandFileArgs, CommandFiles, CommandFilterArgs, CommandFilters, SelectedProperties } from "../../MoveMe"
import { Actions } from "../../Editor/Actions/Actions"
import { SelectType, TrackType } from "../../Setup/Enums"
import { throwError } from "../../Utility/Is"
import { Size } from "../../Utility/Size"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { EffectObject, Effects } from "../Effect/Effect"
import { Track } from "../../Edited/Mash/Track/Track"
import { DefinitionClass, DefinitionObject } from "../../Definition/Definition"
import { Instance, InstanceObject, isInstance, isInstanceObject } from "../../Instance/Instance"

export interface VisibleClipObject extends InstanceObject {
  containerId?: string
  contentId?: string
  content?: ContentObject
  container?: ContainerObject
  effects?: EffectObject[]
  frame? : number
  frames? : number
}
export const isVisibleClipObject = (value: any): value is VisibleClipObject => {
  return isInstanceObject(value) 
}

export interface VisibleClipDefinitionObject extends DefinitionObject {
  audible: boolean
  duration: number
  streamable : boolean
  trackType: TrackType
  visible: boolean
}

export interface VisibleClip extends Instance {

  audible: boolean
  visible : boolean
  
  commandFiles(args: CommandFileArgs): CommandFiles 
  commandFilters(args: CommandFilterArgs): CommandFilters 
  container?: Container
  containerId: string
  content: Content
  contentId: string
  // definition: VisibleClipDefinition
  effects: Effects
  mutable: boolean
  muted: boolean
  notMuted: boolean
  selectedProperties(actions: Actions, selectTypes?: SelectType[]): SelectedProperties
  svgFilters(previewSize: Size, containerRect: Rect, time: Time, range: TimeRange): SvgFilters
  track?: Track
}

export const isVisibleClip = (value: any): value is VisibleClip => {
  return isInstance(value) && "containerId" in value
}
export function assertVisibleClip(value: any, name?: string): asserts value is VisibleClip {
  if (!isVisibleClip(value)) throwError(value, "VisibleClip", name)
}

export interface VisibleClipDefinition extends DefinitionClass {
  instanceFromObject(object?: VisibleClipObject): VisibleClip
}

/**
 * @category Factory
 */
export interface VisibleClipFactory extends GenericFactory<VisibleClip, VisibleClipObject, VisibleClipDefinition, VisibleClipDefinitionObject> {}

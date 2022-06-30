import { CanvasVisibleSource, Constrained } from "../../declarations"
import { Dimensions } from "../../Setup/Dimensions"
import { Time } from "../../Helpers/Time/Time"
import { Clip, ClipDefinition, ClipDefinitionObject, ClipObject, isClip } from "../Clip/Clip"
import { Loader } from "../../Loader/Loader"
import { isObject } from "../../Utility/Is"
import { EffectObject, Effects } from "../../Media/Effect/Effect"

export interface VisibleObject extends ClipObject {
  opacity?: number
  opacityEnd?: number
  mode?: number
  effects?: EffectObject[]
}

export interface VisibleDefinitionObject extends ClipDefinitionObject {
  width?: number
  height?: number
}

export interface Visible extends Clip {
  effects: Effects
}
export const isVisible = (value: any): value is Visible => {
  return isClip(value) && "effects" in value
}

export interface VisibleDefinition extends ClipDefinition {
  width: number
  height: number
  loadedVisible(preloader: Loader, quantize: number, definitionTime: Time): CanvasVisibleSource | undefined
 }


export type VisibleClass = Constrained<Visible>
export type VisibleDefinitionClass = Constrained<VisibleDefinition>

export const isVisibleDefinition = (value: any): value is VisibleDefinition => {
  return isObject(value) && "loadedVisible" in value
}

export interface VisibleContentsArgs {
  preloader: Loader
  time: Time
  quantize: number
  size: Dimensions
}

export interface VisibleContent {
  track: number
  visible?: Visible
}
export type VisibleContents = VisibleContent[]

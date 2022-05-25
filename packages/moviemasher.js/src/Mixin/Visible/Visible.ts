import { CanvasVisibleSource, Constrained, VisibleSource } from "../../declarations"
import { TrackType } from "../../Setup/Enums"
import { Time } from "../../Helpers/Time/Time"
import { VisibleContext } from "../../Context/VisibleContext"
import { Clip, ClipDefinition, ClipDefinitionObject, ClipObject } from "../Clip/Clip"
import { Preloader } from "../../Preloader/Preloader"

export interface VisibleDefinitionObject extends ClipDefinitionObject {
  width?: number
  height?: number
}

export interface VisibleDefinition extends ClipDefinition {
  width: number
  height: number
  loadedVisible(preloader: Preloader, quantize: number, definitionTime: Time): CanvasVisibleSource | undefined
  trackType: TrackType
}

export interface VisibleObject extends ClipObject {
  opacity?: number
  mode?: number
}

export interface Visible extends Clip {
  contextAtTimeToSize(preloader: Preloader, time: Time, quantize: number): VisibleContext | undefined
  definition: VisibleDefinition
  opacity: number
  mode: number
}

export type VisibleClass = Constrained<Visible>
export type VisibleDefinitionClass = Constrained<VisibleDefinition>

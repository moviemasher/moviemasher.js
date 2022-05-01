import { Constrained } from "../../declarations"
import { Effect, EffectObject } from "../../Media/Effect/Effect"
import { Merger, MergerObject } from "../../Media/Merger/Merger"
import { Scaler, ScalerObject } from "../../Media/Scaler/Scaler"
import { Transition } from "../../Media/Transition/Transition"
import {
  Visible, VisibleDefinition, VisibleDefinitionObject, VisibleObject
} from "../Visible/Visible"

export interface TransformableObject extends VisibleObject {
  effects? : EffectObject[]
  merger? : MergerObject
  scaler? : ScalerObject
}

export interface TransformableDefinition extends VisibleDefinition { }

export interface TransformableDefinitionObject extends VisibleDefinitionObject { }

export interface Transformable extends Visible {
  effects : Effect[]
  merger : Merger
  scaler : Scaler
}

export type TransformableClass = Constrained<Transformable>
export type TransformableDefinitionClass = Constrained<TransformableDefinition>


export interface TransformableContent {
  track: number
  transformable?: Transformable
  transition?: Transition
  from?: boolean
}

export type TransformableContents = TransformableContent[]

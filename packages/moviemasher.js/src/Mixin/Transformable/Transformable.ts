import { Constrained } from "../../declarations"
import { Effect, EffectObject } from "../../Media/Effect/Effect"
import { Merger, MergerObject } from "../../Media/Merger/Merger"
import { Scaler, ScalerObject } from "../../Media/Scaler/Scaler"
import { Transition } from "../../Media/Transition/Transition"
import {
  Visible, VisibleDefinition, VisibleDefinitionObject, VisibleObject
} from "../Visible/Visible"

interface TransformableObject extends VisibleObject {
  effects? : EffectObject[]
  merger? : MergerObject
  scaler? : ScalerObject
}

interface TransformableDefinition extends VisibleDefinition { }

interface TransformableDefinitionObject extends VisibleDefinitionObject { }

interface Transformable extends Visible {
  effects : Effect[]
  merger : Merger
  scaler : Scaler
}

type TransformableClass = Constrained<Transformable>
type TransformableDefinitionClass = Constrained<TransformableDefinition>


export interface TransformableContent {
  track: number
  transformable?: Transformable
  transition?: Transition
  from?: boolean
}

export type TransformableContents = TransformableContent[]

export {
  Transformable,
  TransformableClass,
  TransformableDefinition,
  TransformableDefinitionObject,
  TransformableObject,
  TransformableDefinitionClass,
}

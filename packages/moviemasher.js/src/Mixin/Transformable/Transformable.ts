import { VisibleContext } from "../../Context/VisibleContext"
import { Constrained, LoadPromise, Size } from "../../declarations"
import { Time } from "../../Helpers/Time"
import { Effect, EffectObject } from "../../Media/Effect/Effect"
import { Merger, MergerObject } from "../../Media/Merger/Merger"
import { Scaler, ScalerObject } from "../../Media/Scaler/Scaler"
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
  //effectedContextAtTimeToSize(mashTime: Time, quantize: number, dimensions: Size): VisibleContext | undefined
  // loadTransformable(quantize: number, start: Time, end?: Time): LoadPromise | void
  mergeContextAtTime(mashTime : Time, quantize: number, context : VisibleContext) : void
  // scaledContextAtTimeToSize(mashTime : Time, quantize: number, dimensions : Size) : VisibleContext | undefined
}

type TransformableClass = Constrained<Transformable>
type TransformableDefinitionClass = Constrained<TransformableDefinition>

export {
  Transformable,
  TransformableClass,
  TransformableDefinition,
  TransformableDefinitionObject,
  TransformableObject,
  TransformableDefinitionClass,
}

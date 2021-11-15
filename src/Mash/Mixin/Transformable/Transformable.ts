import { VisibleContext } from "../../../Playing/VisibleContext"
import { Any, Constrained, LoadPromise, Size } from "../../../declarations"
import { Time } from "../../../Utilities/Time"
import { Effect, EffectObject } from "../../Effect/Effect"
import { Merger, MergerObject } from "../../Merger/Merger"
import { Scaler, ScalerObject } from "../../Scaler/Scaler"
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
  effectedContextAtTimeToSize(mashTime: Time, quantize: number, dimensions: Size): VisibleContext | undefined
  loadTransformable(quantize: number, start: Time, end?: Time): LoadPromise | void
  mergeContextAtTime(mashTime : Time, quantize: number, context : VisibleContext) : void
  scaledContextAtTimeToSize(mashTime : Time, quantize: number, dimensions : Size) : VisibleContext | undefined
}

type TransformableClass = Constrained<Transformable>

export {
  Transformable,
  TransformableClass,
  TransformableDefinition,
  TransformableDefinitionObject,
  TransformableObject,
}

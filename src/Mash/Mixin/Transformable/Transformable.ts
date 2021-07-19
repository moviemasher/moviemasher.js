import { VisibleContext } from "../../../Playing/VisibleContext"
import { Size } from "../../../declarations"
import { Time } from "../../../Utilities/Time"
import { Effect, EffectObject } from "../../Effect/Effect"
import { Merger, MergerObject } from "../../Merger/Merger"
import { Scaler, ScalerObject } from "../../Scaler/Scaler"
import { Visible, VisibleObject } from "../Visible/Visible"

interface TransformableObject extends VisibleObject {
  effects? : EffectObject[]
  merger? : MergerObject
  scaler? : ScalerObject
}

interface Transformable extends Visible {
  effects : Effect[]
  merger : Merger
  scaler : Scaler
  effectedContextAtTimeToSize(mashTime : Time, quantize: number, dimensions : Size) : VisibleContext | undefined
  mergeContextAtTime(mashTime : Time, quantize: number, context : VisibleContext) : void
  scaledContextAtTimeToSize(mashTime : Time, quantize: number, dimensions : Size) : VisibleContext | undefined
}

export { Transformable, TransformableObject }

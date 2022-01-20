import { VisibleContext } from "../../Context/VisibleContext"
import { GenericFactory } from "../../declarations"
import { Time } from "../../Helpers/Time"
import { FilterObject } from "../Filter/Filter"
import { MergerObject } from "../Merger"
import { ClipDefinitionObject } from "../../Mixin/Clip/Clip"
import {
  Modular,
  ModularDefinition,
  ModularDefinitionObject,
  ModularObject
} from "../../Mixin/Modular/Modular"
import { Visible, VisibleDefinition, VisibleObject } from "../../Mixin/Visible/Visible"
import { ScalerObject } from "../Scaler"

interface TransitionObject extends ModularObject, VisibleObject {
  fromTrack?: number
  toTrack?: number
}

interface Transition extends Modular, Visible {
  definition : TransitionDefinition
  mergeClipsIntoContextAtTime(clips : Visible[], context : VisibleContext, time : Time, quantize: number, color? : string) : void
  fromTrack: number
  toTrack: number
}

interface TransitionDefinitionTransformObject {
  filters? : FilterObject[]
  merger? : MergerObject
  scaler? : ScalerObject
}
interface TransitionDefinitionObject extends ModularDefinitionObject, ClipDefinitionObject {
  to? : TransitionDefinitionTransformObject
  from? : TransitionDefinitionTransformObject
}

interface TransitionDefinition extends ModularDefinition, VisibleDefinition {
  drawVisibleFilters(clips : Visible[], modular : Transition, time : Time, quantize: number, context : VisibleContext, color? : string) : void
  instance : Transition
  instanceFromObject(object : TransitionObject) : Transition
}

/**
 * @category Factory
 */
interface TransitionFactory extends GenericFactory<
  Transition, TransitionObject, TransitionDefinition, TransitionDefinitionObject
> {}

export {
  Transition,
  TransitionDefinition,
  TransitionDefinitionObject,
  TransitionDefinitionTransformObject,
  TransitionFactory,
  TransitionObject
}

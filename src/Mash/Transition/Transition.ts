import { VisibleContext } from "../../Playing/VisibleContext"
import { GenericFactory } from "../../Setup/declarations"
import { Time } from "../../Utilities/Time"
import { FilterObject } from "../Filter/Filter"
import { ClipDefinitionObject } from "../Mixin/Clip/Clip"
import {
  Modular,
  ModularDefinition,
  ModularDefinitionObject,
  ModularObject
} from "../Mixin/Modular/Modular"
import { Visible, VisibleDefinition, VisibleObject } from "../Mixin/Visible/Visible"

type TransitionObject = ModularObject & VisibleObject

interface Transition extends Modular, Visible {
  definition : TransitionDefinition
  mergeClipsIntoContextAtTime(clips : Visible[], context : VisibleContext, time : Time, quantize: number, color? : string) : void
}

interface TransitionDefinitionTransformObject {
  filters? : FilterObject[]
}
interface TransitionDefinitionObject extends ModularDefinitionObject, ClipDefinitionObject {
  to? : TransitionDefinitionTransformObject
  from? : TransitionDefinitionTransformObject
}

interface TransitionDefinition extends Omit <ModularDefinition, "loadedVisible">, VisibleDefinition {
  drawVisibleFilters(clips : Visible[], modular : Modular, time : Time, quantize: number, context : VisibleContext, color? : string) : void
  instance : Transition
  instanceFromObject(object : TransitionObject) : Transition
}

type TransitionFactory = GenericFactory<Transition, TransitionObject, TransitionDefinition, TransitionDefinitionObject>

export {
  Transition,
  TransitionDefinition,
  TransitionDefinitionObject,
  TransitionDefinitionTransformObject,
  TransitionFactory,
  TransitionObject
}

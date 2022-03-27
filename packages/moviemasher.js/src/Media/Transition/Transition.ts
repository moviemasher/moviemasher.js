import { GenericFactory } from "../../declarations"
import { FilterDefinitionObject } from "../Filter/Filter"
import { MergerDefinitionObject } from "../Merger"
import { ClipDefinitionObject } from "../../Mixin/Clip/Clip"
import {
  Modular, ModularDefinition, ModularDefinitionObject, ModularObject
} from "../../Mixin/Modular/Modular"
import { Visible, VisibleDefinition, VisibleObject } from "../../Mixin/Visible/Visible"
import { ScalerDefinitionObject } from "../Scaler"
import { FilterChain } from "../../Edited/Mash/FilterChain/FilterChain"


interface TransitionObject extends ModularObject, VisibleObject {}

export interface TransitionFilterChainArgs {
  filterChain: FilterChain
  from?: boolean
  backcolor: string
  transition: Transition
}

interface Transition extends Modular, Visible {
  definition: TransitionDefinition
  filterChain(filterChain: FilterChain): void
}

interface TransitionDefinitionTransformObject {
  filters? : FilterDefinitionObject[]
  merger? : MergerDefinitionObject
  scaler? : ScalerDefinitionObject
}
interface TransitionDefinitionObject extends ModularDefinitionObject, ClipDefinitionObject {
  to? : TransitionDefinitionTransformObject
  from? : TransitionDefinitionTransformObject
}

interface TransitionDefinition extends ModularDefinition, VisibleDefinition {
  transitionFilterChain(args: TransitionFilterChainArgs): void
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

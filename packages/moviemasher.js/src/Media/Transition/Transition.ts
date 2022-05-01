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


export interface TransitionObject extends ModularObject, VisibleObject {}

export interface TransitionFilterChainArgs {
  filterChain: FilterChain
  from?: boolean
  backcolor: string
  transition: Transition
}

export interface Transition extends Modular, Visible {
  definition: TransitionDefinition
  filterChain(filterChain: FilterChain): void
}

export interface TransitionDefinitionTransformObject {
  filters? : FilterDefinitionObject[]
  merger? : MergerDefinitionObject
  scaler? : ScalerDefinitionObject
}

export interface TransitionDefinitionObject extends ModularDefinitionObject, ClipDefinitionObject {
  to? : TransitionDefinitionTransformObject
  from? : TransitionDefinitionTransformObject
}

export interface TransitionDefinition extends ModularDefinition, VisibleDefinition {
  transitionFilterChain(args: TransitionFilterChainArgs): void
  instance : Transition
  instanceFromObject(object : TransitionObject) : Transition
}

/**
 * @category Factory
 */
export interface TransitionFactory extends GenericFactory<
  Transition, TransitionObject, TransitionDefinition, TransitionDefinitionObject
> {}

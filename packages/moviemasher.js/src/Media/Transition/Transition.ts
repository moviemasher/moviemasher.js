import { VisibleContext } from "../../Context/VisibleContext"
import { FilterChain, FilterChainArgs, GenericFactory } from "../../declarations"
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
import { Preloader } from "../../Preloader/Preloader"


interface TransitionObject extends ModularObject, VisibleObject {
  fromTrack?: number
  toTrack?: number
}

interface Transition extends Modular, Visible {
  definition : TransitionDefinition
  mergeClipsIntoContextAtTime(preloader: Preloader, context: VisibleContext, time: Time, quantize: number, fromClip?: Visible, toClip?: Visible, color?: string): void
  transitionFilterChains(layerArgs: FilterChainArgs, from?: Visible, to?: Visible, backcolor?: string): FilterChain
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
  mergeFilterChain(transition: Transition, args: FilterChainArgs, from?: Visible, to?: Visible, backcolor?: string): FilterChain
  mergeClips(transition: Transition, preloader: Preloader, time : Time, quantize: number, context : VisibleContext, fromClip?: Visible, toClip?: Visible, color? : string) : void
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

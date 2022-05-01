import { Any, UnknownObject } from "../../declarations"
import { DefinitionType } from "../../Setup/Enums"
import { TransitionClass } from "./TransitionClass"
import { Transition, TransitionDefinition, TransitionFilterChainArgs, TransitionObject } from "./Transition"
import { DefinitionBase } from "../../Base/Definition"
import { Filter } from "../Filter/Filter"
import { ModularDefinitionMixin } from "../../Mixin/Modular/ModularDefinitionMixin"
import { ClipDefinitionMixin } from "../../Mixin/Clip/ClipDefinitionMixin"
import { VisibleDefinitionMixin } from "../../Mixin/Visible/VisibleDefinitionMixin"
import { TransitionDefinitionObject } from "./Transition"
import { filterInstance } from "../Filter"
import { mergerInstance } from "../Merger/MergerFactory"
import { scalerInstance } from "../Scaler/ScalerFactory"
import { FilterChain } from "../../Edited/Mash/FilterChain/FilterChain"

const TransitionDefinitionWithModular = ModularDefinitionMixin(DefinitionBase)
const TransitionDefinitionWithClip = ClipDefinitionMixin(TransitionDefinitionWithModular)
const TransitionDefinitionWithVisible = VisibleDefinitionMixin(TransitionDefinitionWithClip)
export class TransitionDefinitionClass extends TransitionDefinitionWithVisible implements TransitionDefinition {
  constructor(...args : Any[]) {
    super(...args)
    const [object] = args

    const { to, from } = <TransitionDefinitionObject> object

    if (to) {
      const { filters, merger, scaler } = to
      if (filters) {
        this.toFilters.push(...filters.map(filter => filterInstance(filter)))
      }
      if (merger) this.toMerger = mergerInstance(merger)
      if (scaler) this.toScaler = scalerInstance(scaler)
    }

    if (from) {
      const { filters, merger, scaler } = from
      if (filters) {
        this.fromFilters.push(...filters.map(filter => filterInstance(filter)))
      }
      if (merger) this.fromMerger = mergerInstance(merger)
      if (scaler) this.fromScaler = scalerInstance(scaler)
    }
  }

  transitionFilterChain(args: TransitionFilterChainArgs): FilterChain {
    const { from, filterChain, transition } = args
    const scaler = from ? this.fromScaler : this.toScaler
    const merger = from ? this.fromMerger : this.toMerger

    this.filters = from ? this.fromFilters : this.toFilters
    this.populateFilterChain(filterChain, transition)
    // scaler.definition.populateFilterChain(filterChain, scaler)
    merger.definition.populateFilterChain(filterChain, merger)
    return filterChain
  }

  private fromFilters : Filter[] = []

  private fromMerger = mergerInstance({})

  private fromScaler = scalerInstance({})

  get instance() : Transition { return this.instanceFromObject(this.instanceObject) }

  instanceFromObject(object : TransitionObject) : Transition {
    return new TransitionClass({ ...this.instanceObject, ...object })
  }

  private toFilters : Filter[] = []

  private toMerger = mergerInstance({})

  private toScaler = scalerInstance({})

  toJSON() : UnknownObject {
    return {
      ...super.toJSON(),
      to: { filters: this.toFilters },
      from: { filters: this.fromFilters },
    }
  }

  type = DefinitionType.Transition
}

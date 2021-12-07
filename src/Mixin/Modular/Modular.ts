import { VisibleContext } from "../../Playing/VisibleContext"
import { Any, Constrained, InputFilter, LoadPromise, ObjectUnknown, Size, UnknownObject } from "../../declarations"
import { Evaluator } from "../../Utilities/Evaluator"
import { TimeRange } from "../../Utilities/TimeRange"
import { Definition, DefinitionObject } from "../../Base/Definition"
import { Filter } from "../../Mash/Filter/Filter"
import { Instance, InstanceObject } from "../../Base/Instance"
import { Time } from "../../Utilities/Time"


type ModularObject = InstanceObject

interface Modular extends Instance {
  definition: ModularDefinition
  constructProperties(object?: Any): void
  loadModular(quantize: number, start: Time, end?: Time): LoadPromise | void
  modularUrls(quantize : number, start : Time, end? : Time) : string[]
}

// JSON is hash { PROPERTY_NAME: PROPERTY_OBJECT }
interface ModularDefinitionObject extends DefinitionObject {
  filters? : UnknownObject[]
  properties? : ObjectUnknown
}

// but Definition uses an array of properties to ease filtering/sorting
interface ModularDefinition extends Definition {
  filters : Filter[]
  drawFilters(modular: Modular, range : TimeRange, context : VisibleContext, size : Size, outContext?: VisibleContext) : VisibleContext

  evaluator(modular: Modular, range : TimeRange, size : Size, context? : VisibleContext, mergerContext? : VisibleContext) : Evaluator

  inputFilters(modular: Modular, range: TimeRange, size: Size): InputFilter[]
}

type ModularClass = Constrained<Modular>
type ModularDefinitionClass = Constrained<ModularDefinition>

export {
  Modular,
  ModularClass,
  ModularDefinition,
  ModularDefinitionClass,
  ModularDefinitionObject,
  ModularObject,
}

import { VisibleContext } from "../../../Playing/VisibleContext"
import { ObjectUnknown, Size, UnknownObject } from "../../../declarations"
import { Evaluator } from "../../../Utilities/Evaluator"
import { TimeRange } from "../../../Utilities/TimeRange"
import { Definition, DefinitionObject } from "../../Definition/Definition"
import { Filter } from "../../Filter/Filter"
import { Instance, InstanceObject } from "../../Instance/Instance"

type ModularObject = InstanceObject

interface Modular extends Instance {
  definition : ModularDefinition
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

  evaluator(modular: Modular, range : TimeRange, context : VisibleContext, size : Size, mergerContext? : VisibleContext) : Evaluator
}

export { Modular, ModularDefinition, ModularDefinitionObject, ModularObject }

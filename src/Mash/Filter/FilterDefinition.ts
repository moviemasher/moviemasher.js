import { Any, ValueObject } from "../../declarations"
import { Parameter } from "../../Setup/Parameter"
import { Evaluator } from "../../Utilities/Evaluator"
import { DefinitionClass } from "../Definition/Definition"
import { VisibleContext } from "../../Playing"
import { Filter, FilterObject } from "./Filter"
import { FilterClass } from "./FilterInstance"
import { DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Definitions } from "../Definitions/Definitions"


class FilterDefinitionClass extends DefinitionClass {
  constructor(...args : Any[]) {
    super(...args)
    Definitions.install(this)
  }

  draw(_evaluator : Evaluator, _evaluated : ValueObject) : VisibleContext {
    throw Errors.unimplemented
  }

  get instance() : Filter {
    return this.instanceFromObject(this.instanceObject)
  }

  instanceFromObject(object : FilterObject) : Filter {
    const instance = new FilterClass({ ...this.instanceObject, ...object })
    return instance
  }

  parameters : Parameter[] = []

  scopeSet(_evaluator : Evaluator) : void {}

  type = DefinitionType.Filter
}

export { FilterDefinitionClass }

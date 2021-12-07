import { Any, InputFilter, ValueObject } from "../../declarations"
import { Parameter } from "../../Setup/Parameter"
import { Evaluator } from "../../Utilities/Evaluator"
import { DefinitionBase } from "../../Base/Definition"
import { VisibleContext } from "../../Playing"
import { Filter, FilterObject } from "./Filter"
import { FilterClass } from "./FilterInstance"
import { DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Definitions } from "../../Definitions/Definitions"


class FilterDefinitionClass extends DefinitionBase {
  constructor(...args : Any[]) {
    super(...args)
    Definitions.install(this)
  }

  draw(_evaluator : Evaluator, _evaluated : ValueObject) : VisibleContext {
    throw Errors.unimplemented + this.id
  }

  input(_evaluator: Evaluator, _evaluated: ValueObject): InputFilter {
    throw Errors.unimplemented + this.id
  }

  get instance() : Filter {
    return this.instanceFromObject(this.instanceObject)
  }

  instanceFromObject(object : FilterObject) : Filter {
    const instance = new FilterClass({ ...this.instanceObject, ...object })
    return instance
  }

  parameters : Parameter[] = []

  retain = true

  scopeSet(_evaluator : Evaluator) : void {}

  type = DefinitionType.Filter
}

export { FilterDefinitionClass }

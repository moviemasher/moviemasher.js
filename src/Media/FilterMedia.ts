import { MediaType } from "../Setup"
import { sharedMedia } from "./with/sharedMedia"
import { modular } from "./with/modular"
import { parameters } from "./with/parameters"
import { Is, Throw } from "../Utilities"
import { FilterFactory } from "../Factory/FilterFactory"
import { CoreFilter } from "../CoreFilter"
import { drawFilters } from "./with/drawFilters"
import { Media } from "./Media"

class FilterMedia extends Media {
  type : string = MediaType.filter
}

Object.defineProperties(FilterMedia.prototype, {
  ...sharedMedia,
  ...modular,
  ...parameters,
  coreFilter: {
    get() {
      if (Is.undefined(this.__coreFilter)) {
        this.__coreFilter = FilterFactory.create(this.id)
        Throw.unlessInstanceOf(this.__coreFilter, CoreFilter)
      }
      return this.__coreFilter
    }
  },
  evaluateScope: {
    value(evaluator) {
      const evaluated = {}
      const definitions = this.parameters || this.coreFilter.parameters
      if (Is.not(definitions)) return evaluated

      definitions.forEach(parameter => {
        const { name } = parameter
        if (Is.not(name)) return

        evaluated[name] = evaluator.evaluate(parameter.value)
        evaluator.set(name, evaluated[name])
      })
      return evaluated
    }
  },
  ...drawFilters,
})

export { FilterMedia }

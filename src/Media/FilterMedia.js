
import { MediaType } from "../Types"
import { sharedMedia } from "./with/sharedMedia";
import { modular } from "./with/modular"
import { parameters } from "./with/parameters";
import { Is } from "../Is";
import { FilterFactory } from "../Factory/FilterFactory";
import { Errors } from "../Errors";
import { CoreFilter } from "../CoreFilter";
import { drawFilters } from "./with/drawFilters";
 
function FilterMedia(object) { this.object = object }

Object.defineProperties(FilterMedia.prototype, {
  type: { value: MediaType.filter },
  ...sharedMedia,
  ...modular,
  ...parameters,
  
  coreFilter: { 
    get: function() { 
      if (Is.undefined(this.__coreFilter)) {
        this.__coreFilter = FilterFactory.create(this.id)
        Errors.throwUnlessInstance(this.__coreFilter, CoreFilter)
      }
      return this.__coreFilter 
    }
  },
  evaluateScope: { 
    value: function(evaluator) {
      const evaluated = {}
      const parameters = this.parameters || this.coreFilter.parameters
      if (Is.not(parameters)) return evaluated
     
      parameters.forEach(parameter => {
        const name = parameter.name
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

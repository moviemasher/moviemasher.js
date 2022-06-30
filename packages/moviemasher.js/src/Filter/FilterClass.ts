import { InstanceBase } from "../Instance/InstanceBase"
import { SvgContent, SvgFilters, UnknownObject, ScalarObject } from "../declarations"
import { CommandFilters, FilterArgs, FilterCommandFilterArgs } from "../MoveMe"
import { Errors } from "../Setup/Errors"
import { isPopulatedObject } from "../Utility/Is"
import { Filter, FilterDefinition } from "./Filter"
import { Parameter } from "../Setup/Parameter"
import { FilterObject } from "./Filter"
import { PropertyTweenSuffix } from "../Base/Propertied"

export class FilterClass extends InstanceBase implements Filter {
  constructor(...args : any[]) {
    super(...args)
    const [object] = args
    if (!isPopulatedObject(object)) throw Errors.invalid.object + 'filter'

    const { parameters } = object as FilterObject
    if (parameters?.length) this.parameters.push(...parameters.map(parameter => {
      const { name, dataType } = parameter

      if (!dataType) {
        // try to determine type from same parameter in definition
        const existing = this.definition.parameters.find(p => p.name === name)
        if (existing) parameter.dataType = existing.dataType
      }
      // console.log(this.constructor.name, "constructor", parameter)
      return new Parameter(parameter)
    }))
  }
  commandFilters(args: FilterCommandFilterArgs): CommandFilters {
    return this.definition.commandFilters({ ...args, filter: this })
  }

  declare definition : FilterDefinition

  parameters : Parameter[] = []

  _parametersDefined?: Parameter[]
  get parametersDefined(): Parameter[] {
    if (this._parametersDefined) return this._parametersDefined

    const parameters = [...this.parameters]
    parameters.push(...this.definition.parameters.filter(parameter =>
      !parameters.find(p => p.name === parameter.name)
    ))
    return this._parametersDefined = parameters
  }

  filterSvg(args: FilterArgs = {}): SvgContent {
    return this.definition.filterDefinitionSvg({ ...args, filter: this })
  }

  filterSvgFilters(tweening = false): SvgFilters {
    const valueObject = this.scalarObject(tweening)
    return this.definition.filterDefinitionSvgFilters(valueObject)
  }

  toJSON() : UnknownObject {
    const object : UnknownObject = { id: this.definitionId }
    if (this.parameters.length) object.parameters = this.parameters
    return object
  }

  toString(): string {
    return `[Filter ${this.label}]`
  }

  scalarObject(tweening = false): ScalarObject {
    const object: ScalarObject = {}
     this.properties.forEach(property => {
      const { name, tweenable } = property
      object[name] = this.value(name)
      if (!(tweening && tweenable)) return
      
      const key = `${name}${PropertyTweenSuffix}`
      object[key] = this.value(key)
    })
    // console.log(this.constructor.name, "scalerObject", tweening, object)
   
    return object
  }
}

import { SvgFilters, UnknownObject, ScalarObject, SvgItems } from "../../declarations"
import { InstanceBase } from "../../Instance/InstanceBase"
import { CommandFiles, CommandFilters, FilterArgs, FilterCommandFileArgs, FilterCommandFilterArgs } from "../../MoveMe"
import { Errors } from "../../Setup/Errors"
import { isDefined, isNumber, isPopulatedObject, isPopulatedString, isString } from "../../Utility/Is"
import { Filter, FilterDefinition, FilterObject } from "./Filter"
import { Parameter } from "../../Setup/Parameter"
import { PropertyTweenSuffix } from "../../Base/Propertied"

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


  commandFiles(args: FilterCommandFileArgs): CommandFiles {
    return this.definition.commandFiles({ ...args, filter: this })
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

  filterSvgs(args: FilterArgs = {}): SvgItems {
    return this.definition.filterDefinitionSvgs({ ...args, filter: this })
  }

  filterSvgFilter(): SvgFilters {
    const valueObject = this.scalarObject()
    return this.definition.filterDefinitionSvgFilter(valueObject)
  }

  scalarObject(tweening = false): ScalarObject {
    const object: ScalarObject = {}
    const { parametersDefined } = this

    parametersDefined.forEach(parameter => {
      const { name, value } = parameter
      if (isPopulatedString(value)) {
        const property = this.properties.find(property => value === property.name)
        if (property) return 
      }
      if (isNumber(value) || isString(value)) object[name] = value
    })
    this.properties.forEach(property => {
      const { tweenable, name } = property
      if (isDefined(object[name])) return

      object[name] = this.value(name)
      if (!(tweening && tweenable)) return
      
      const key = `${name}${PropertyTweenSuffix}`
      object[key] = this.value(key)
    })
    // console.log(this.constructor.name, "scalerObject", object, parametersDefined.map(p => p.name))
    return object
  }

  toJSON() : UnknownObject {
    const object : UnknownObject = { id: this.definitionId }
    if (this.parameters.length) object.parameters = this.parameters
    return object
  }

  toString(): string {
    return `[Filter ${this.label}]`
  }
}

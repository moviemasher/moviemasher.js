import { ScalarRecord } from "../declarations"
import { SvgFilters, SvgItems } from "../Helpers/Svg/Svg"
import { CommandFiles, CommandFilters, FilterCommandFileArgs, FilterCommandFilterArgs } from "../Base/Code"
import { isDefined, isNumber, isPopulatedString, isString } from "../Utility/Is"
import { assertFilterDefinition, Filter, FilterArgs, FilterDefinition, FilterObject } from "./Filter"
import { Parameter } from "../Setup/Parameter"
import { PropertiedClass, PropertyTweenSuffix } from "../Base/Propertied"

export class FilterClass extends PropertiedClass implements Filter {
  constructor(object: FilterObject) {
    super()
   
    const { definition, parameters } = object 
    assertFilterDefinition(definition)

    this.definition = definition

    
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
    this.properties.push(...this.definition.properties)
    this.propertiesInitialize(object)
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
  
  protected _label = ''
  get label(): string { return this._label  }
  set label(value: string) { this._label = value }

  scalarObject(tweening = false): ScalarRecord {
    const object: ScalarRecord = {}
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

  toString(): string {
    return `[Filter ${this.label}]`
  }
}

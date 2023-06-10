import { DataType } from "@moviemasher/runtime-shared"
import { DataTypeNumber } from "../../../Setup/DataTypeConstants.js"
import { propertyInstance } from "../../../Setup/PropertyFunctions.js"
import { FilterDefinitionObject } from '../Filter.js'
import { FilterDefinitionClass } from '../FilterDefinitionClass.js'

/**
 * @category Filter
 */
export class TrimFilter extends FilterDefinitionClass {
  constructor(object: FilterDefinitionObject) {
    super(object)
    this.properties.push(propertyInstance({
      custom: true, name: 'start', type: DataTypeNumber, defaultValue: 0
    }))
    
    this.populateParametersFromProperties()
  }
}

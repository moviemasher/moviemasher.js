import { DataType } from "@moviemasher/runtime-shared"
import { DataTypeString } from "../../../Setup/DataTypeConstants.js"
import { propertyInstance } from "../../../Setup/PropertyFunctions.js"
import { FilterDefinitionObject } from '../Filter.js'
import { FilterDefinitionClass } from '../FilterDefinitionClass.js'

/**
 * @category Filter
 */
export class SetptsFilter extends FilterDefinitionClass {
  constructor(object: FilterDefinitionObject) {
    super(object)
    this.properties.push(propertyInstance({
      custom: true, name: 'expr', type: DataTypeString, defaultValue: 'PTS-STARTPTS'
    }))
    this.populateParametersFromProperties()
  }
}

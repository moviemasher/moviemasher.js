import { DataType, DataTypeString } from '../../../Setup/Enums.js'
import { propertyInstance } from '../../../Setup/Property.js'
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

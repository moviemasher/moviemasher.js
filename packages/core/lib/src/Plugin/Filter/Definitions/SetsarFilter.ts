import { DataTypeNumber, DataTypeString } from '../../../Setup/Enums.js'
import { propertyInstance } from '../../../Setup/Property.js'
import { FilterDefinitionObject } from '../Filter.js'
import { FilterDefinitionClass } from '../FilterDefinitionClass.js'

/**
 * @category Filter
 */
export class SetsarFilter extends FilterDefinitionClass {
  constructor(object: FilterDefinitionObject) {
    super(object)
    this.properties.push(propertyInstance({
      custom: true, name: 'sar', type: DataTypeString, defaultValue: '0'
    }))
    this.properties.push(propertyInstance({
      custom: true, name: 'max', type: DataTypeNumber, defaultValue: 100
    }))
    this.populateParametersFromProperties()
  }
}

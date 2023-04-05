import { DataType } from '../../../Setup/Enums.js'
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
      custom: true, name: 'sar', type: DataType.String, defaultValue: '0'
    }))
    this.properties.push(propertyInstance({
      custom: true, name: 'max', type: DataType.Number, defaultValue: 100
    }))
    this.populateParametersFromProperties()
  }
}

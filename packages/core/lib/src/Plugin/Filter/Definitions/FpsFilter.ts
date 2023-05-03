import { DataTypeNumber } from '../../../Setup/Enums.js'
import { propertyInstance } from '../../../Setup/Property.js'
import { FilterDefinitionObject } from '../Filter.js'
import { FilterDefinitionClass } from '../FilterDefinitionClass.js'

/**
 * @category Filter
 */
export class FpsFilter extends FilterDefinitionClass {
  constructor(object: FilterDefinitionObject) {
    super(object)
    this.properties.push(propertyInstance({
      custom: true, name: 'fps', type: DataTypeNumber
    }))
    this.populateParametersFromProperties()
  }
}

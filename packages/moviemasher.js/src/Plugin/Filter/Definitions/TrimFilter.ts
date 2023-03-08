import { DataType } from "../../../Setup/Enums"
import { propertyInstance } from "../../../Setup/Property"
import { FilterDefinitionObject } from "../Filter"
import { FilterDefinitionClass } from "../FilterDefinitionClass"

/**
 * @category Filter
 */
export class TrimFilter extends FilterDefinitionClass {
  constructor(object: FilterDefinitionObject) {
    super(object)
    this.properties.push(propertyInstance({
      custom: true, name: 'start', type: DataType.Number, defaultValue: 0
    }))
    
    this.populateParametersFromProperties()
  }
}

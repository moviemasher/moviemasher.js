import { DataType } from "../../../Setup/Enums"
import { propertyInstance } from "../../../Setup/Property"
import { FilterDefinitionObject } from "../Filter"
import { FilterDefinitionClass } from "../FilterDefinitionClass"

/**
 * @category Filter
 */
export class FpsFilter extends FilterDefinitionClass {
  constructor(object: FilterDefinitionObject) {
    super(object)
    this.properties.push(propertyInstance({
      custom: true, name: 'fps', type: DataType.Number
    }))
    this.populateParametersFromProperties()
  }
}

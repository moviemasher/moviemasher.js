import { DataType } from "../../../Setup/Enums"
import { propertyInstance } from "../../../Setup/Property"
import { FilterDefinitionClass } from "../FilterDefinitionClass"

/**
 * @category Filter
 */
export class FpsFilter extends FilterDefinitionClass {
  constructor(...args: any[]) {
    super(...args)
    this.properties.push(propertyInstance({
      custom: true, name: 'fps', type: DataType.Number
    }))
    this.populateParametersFromProperties()
  }
}

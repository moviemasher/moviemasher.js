import { DataType } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { FilterDefinitionObject } from "../Filter"
import { FilterDefinitionClass } from "../FilterDefinitionClass"

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

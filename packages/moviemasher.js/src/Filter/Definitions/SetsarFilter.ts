import { DataType, Phase } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { FilterDefinitionClass } from "../FilterDefinitionClass"

/**
 * @category Filter
 */
export class SetsarFilter extends FilterDefinitionClass {
  constructor(...args: any[]) {
    super(...args)
    this.properties.push(propertyInstance({
      custom: true, name: 'sar', type: DataType.String, defaultValue: '0'
    }))
    this.properties.push(propertyInstance({
      custom: true, name: 'max', type: DataType.Number, defaultValue: 100
    }))
    this.populateParametersFromProperties()
  }

  phase = Phase.Populate
}

import { DataType } from "../../../Setup/Enums"
import { propertyInstance } from "../../../Setup/Property"
import { FilterDefinitionClass } from "../FilterDefinitionClass"

/**
 * @category Filter
 */
export class SetptsFilter extends FilterDefinitionClass {
  constructor(...args: any[]) {
    super(...args)
    this.properties.push(propertyInstance({
      custom: true, name: 'expr', type: DataType.String, defaultValue: 'PTS-STARTPTS'
    }))
    this.populateParametersFromProperties()
  }
}

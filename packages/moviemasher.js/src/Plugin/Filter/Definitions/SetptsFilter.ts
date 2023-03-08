import { DataType } from "../../../Setup/Enums"
import { propertyInstance } from "../../../Setup/Property"
import { FilterDefinitionObject } from "../Filter"
import { FilterDefinitionClass } from "../FilterDefinitionClass"

/**
 * @category Filter
 */
export class SetptsFilter extends FilterDefinitionClass {
  constructor(object: FilterDefinitionObject) {
    super(object)
    this.properties.push(propertyInstance({
      custom: true, name: 'expr', type: DataType.String, defaultValue: 'PTS-STARTPTS'
    }))
    this.populateParametersFromProperties()
  }
}

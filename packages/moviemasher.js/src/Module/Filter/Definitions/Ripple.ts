import { ValueObjectsTuple } from "../../../declarations"
import { DataType, Orientation } from "../../../Setup/Enums"
import { propertyInstance } from "../../../Setup/Property"
import { Rect } from "../../../Utility/Rect"
import { Size } from "../../../Utility/Size"
import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { DisplaceFilter } from "./DisplaceFilter"

/**
 * @category Filter
 */
export class RippleFilter extends DisplaceFilter {
  constructor(...args: any[]) {
    super(...args)
    this.properties.push(propertyInstance({
      custom: true, name: 'ripples', type: DataType.Number
    }))
    this.populateParametersFromProperties()
  }

  protected override svgTags(orientation: Orientation, position: number, size: Size, rect: Rect): ValueObjectsTuple {
    return super.svgTags(orientation, position, size, rect)
  }
}

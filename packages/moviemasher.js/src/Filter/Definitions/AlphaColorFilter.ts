import { assertPropertyType, DataType } from "../../Setup/Enums"
import { colorBlackOpaque } from "../../Utility/Color"
import { ColorFilter } from "./ColorFilter"

/**
 * @category Filter
 */
export class AlphaColorFilter extends ColorFilter {
  constructor(...args: any[]) {
    super(...args)
    const property = this.properties.find(property => property.name === 'color')
    assertPropertyType(property?.type)
    property.type = DataType.Rgba
    property.defaultValue = colorBlackOpaque
  }
}

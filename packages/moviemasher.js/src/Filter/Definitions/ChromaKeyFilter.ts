import { SvgFilters, ScalarObject } from "../../declarations"
import { DataType } from "../../Setup/Enums"
import { NamespaceSvg } from "../../Setup/Constants"
import { propertyInstance } from "../../Setup/Property"
import { colorGreen, colorToRgb } from "../../Utility/Color"
import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { assertNumber, assertPopulatedString } from "../../Utility/Is"

/**
 * @category Filter
 */
export class ChromaKeyFilter extends FilterDefinitionClass {
  constructor(...args: any[]) {
    super(...args)
    this.properties.push(propertyInstance({
      custom: true, name: 'color', type: DataType.String,
      defaultValue: colorGreen
    }))
    this.properties.push(propertyInstance({
      custom: true, name: 'similarity', type: DataType.Percent,
      defaultValue: 0.0
    }))
    this.properties.push(propertyInstance({
      custom: true, name: 'blend', type: DataType.Percent,
      defaultValue: 0.01
    }))
    this.populateParametersFromProperties()
  }

  filterDefinitionSvgFilters(object: ScalarObject): SvgFilters {
    const { similarity, color, blend } = object
    assertNumber(similarity)
    assertNumber(blend)
    assertPopulatedString(color)

    const filterElement = globalThis.document.createElementNS(NamespaceSvg, 'feColorMatrix')
    const max = 255.0
    const range = max * max * (1.0 - blend)
    const rgb = colorToRgb(color)

    const r = 1.0 - (similarity * (max / rgb.r))
    const g = 1.0 - (similarity * (max / rgb.g))
    const b = 1.0 - (similarity * (max / rgb.b))

    filterElement.setAttribute('type', 'matrix')
    filterElement.setAttribute('values', `1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 ${r} ${g} ${b} -${range} ${range}`)

    return [filterElement]
  }
}
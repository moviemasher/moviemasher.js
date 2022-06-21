import { SvgFilters, ValueObject } from "../../declarations"
import { Dimensions } from "../../Setup/Dimensions"
import { DataType } from "../../Setup/Enums"
import { NamespaceSvg } from "../../Setup/Constants"
import { propertyInstance } from "../../Setup/Property"
import { colorGreen, colorToRgb } from "../../Utility/Color"
import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { FilterChain } from "../../Edited/Mash/FilterChain/FilterChain"
import { ChainPhase } from "../Filter"

/**
 * @category Filter
 */
export class ChromaKeyFilter extends FilterDefinitionClass {
  constructor(...args: any[]) {
    super(...args)
    this.properties.push(propertyInstance({
      custom: true, name: 'color', type: DataType.Rgb,
      defaultValue: colorGreen
    }))
    this.properties.push(propertyInstance({
      custom: true, name: 'similarity', type: DataType.Number,
      defaultValue: 0.0, min: 0.0, max: 1.0, step: 0.01
    }))
    this.properties.push(propertyInstance({
      custom: true, name: 'blend', type: DataType.Number,
      defaultValue: 0.01, min: 0.0, max: 1.0, step: 0.01
    }))
    this.populateParametersFromProperties()
  }

  filterChain(filterChain: FilterChain): ChainPhase | undefined {
    const { evaluator } = filterChain
    return { values: evaluator.parameters }
  }

  svgFilters(dimensions: Dimensions, valueObject: ValueObject): SvgFilters {
    const similarity = Number(valueObject.similarity)
    const color = String(valueObject.color)
    const blend = Number(valueObject.blend)

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

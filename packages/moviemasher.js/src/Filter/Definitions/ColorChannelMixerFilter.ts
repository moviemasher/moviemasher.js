import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { colorRgbaKeys } from "../../Utility/Color"
import { DataType } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { NamespaceSvg } from "../../Setup/Constants"
import { ChainPhase } from "../Filter"
import { SvgFilters, ValueObject } from "../../declarations"
import { Dimensions } from "../../Setup/Dimensions"
import { FilterChain } from "../../Edited/Mash/FilterChain/FilterChain"

const ColorChannelMixerFilterKeys = colorRgbaKeys.flatMap(c =>
  colorRgbaKeys.map(d => `${c}${d}`)
)

/**
 * @category Filter
 */
export class ColorChannelMixerFilter extends FilterDefinitionClass {
  constructor(...args: any[]) {
    super(...args)
    ColorChannelMixerFilterKeys.forEach(name => {
      this.properties.push(propertyInstance({
        custom: true, name, type: DataType.Number,
        defaultValue: name[0] === name[1] ? 1.0 : 0.0,
        min: 0.0, max: 1.0
      }))
    })
    this.populateParametersFromProperties()
  }

  filterChain(filterChain: FilterChain): ChainPhase | undefined {
    const { evaluator } = filterChain

    return { values: evaluator.parameters }
  }

  svgFilters(dimensions: Dimensions, valueObject: ValueObject): SvgFilters {
    const bits = colorRgbaKeys.flatMap(c =>
      [...colorRgbaKeys.map(d => Number(valueObject[`${c}${d}`])), 0]
    )
    const filterElement = globalThis.document.createElementNS(NamespaceSvg, 'feColorMatrix')
    filterElement.setAttribute('type', 'matrix')
    filterElement.setAttribute('values', bits.join(' '))
    return [filterElement]
  }
}

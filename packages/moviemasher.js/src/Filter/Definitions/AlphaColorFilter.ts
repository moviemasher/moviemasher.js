import { SvgContent, ValueObject } from "../../declarations"
import { Dimensions } from "../../Setup/Dimensions"
import { ChainBuilder, CommandFilter } from "../../MoveMe"
import { pixelColor } from "../../Utility/Pixel"
import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { DataType } from "../../Setup/Enums"
import { colorTransparent } from "../../Utility/Color"
import { propertyInstance } from "../../Setup/Property"
import { NamespaceSvg } from "../../Setup/Constants"
import { ServerFilters } from "../Filter"
import { assertPopulatedString } from "../../Utility/Is"
import { FilterChain } from "../../Edited/Mash/FilterChain/FilterChain"

/**
 * @category Filter
 */
export class AlphaColorFilter extends FilterDefinitionClass {
  constructor(...args: any[]) {
    super(...args)
    this.properties.push(propertyInstance({
      custom: true, name: 'color', type: DataType.Rgba,
      defaultValue: colorTransparent,
    }))
    this.populateParametersFromProperties()
  }

  _ffmpegFilter = 'color'

  serverFilters(filterChain: FilterChain, values: ValueObject): ServerFilters {
    const { ffmpegFilter } = this
    const { filterGraph } = filterChain
    const { videoRate: rate, size } = filterGraph
    const { width, height } = size

    const serverFilter: CommandFilter = {
      ffmpegFilter, options: { ...values, rate, size: `${width}x${height}` }
    }
    return [serverFilter]
  }

  valueObject(filterChain: ChainBuilder): ValueObject {
    const { evaluator } = filterChain
    return { color: String(evaluator.parameter('color')) }
  }

  svgContent(dimensions: Dimensions, valueObject: ValueObject): SvgContent {
    const { color } = valueObject
    assertPopulatedString(color)

    const { width, height } = dimensions
    const rectElement = globalThis.document.createElementNS(NamespaceSvg, 'rect')
    rectElement.setAttribute('width', String(width))
    rectElement.setAttribute('height', String(height))
    rectElement.setAttribute('fill', pixelColor(color))
    return rectElement
  }

}

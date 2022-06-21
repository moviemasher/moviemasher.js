import { SvgContent, ValueObject } from "../../declarations"
import { Dimensions } from "../../Setup/Dimensions"
import { Chain, ChainBuilder, CommandFilter } from "../../MoveMe"
import { pixelColor } from "../../Utility/Pixel"
import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { DataType, Phase } from "../../Setup/Enums"
import { colorYellow } from "../../Utility/Color"
import { propertyInstance } from "../../Setup/Property"
import { NamespaceSvg } from "../../Setup/Constants"
import { Filter, ServerFilters } from "../Filter"
import { assertAboveZero, assertPopulatedString, assertPositive } from "../../Utility/Is"
import { FilterChain } from "../../Edited/Mash/FilterChain/FilterChain"
import { Propertied } from "../../Base/Propertied"

/**
 * @category Filter
 */
export class ColorFilter extends FilterDefinitionClass {
  constructor(...args: any[]) {
    super(...args)
    this.properties.push(propertyInstance({
      custom: true, name: 'color', type: DataType.Rgb, 
      defaultValue: colorYellow
    }))
    const keys = ['rate', 'width', 'height']
    keys.forEach(name => {
      this.properties.push(propertyInstance({
        custom: true, name, type: DataType.Number, defaultValue: 0,
      }))
    })
    this.populateParametersFromProperties()
  }
  
  chain(outputDimensions: Dimensions, filter: Filter, propertied?: Propertied): Chain {
    const chain = super.chain(outputDimensions, filter, propertied)
    const { commandFilters } = chain
    const values = this.chainValues(filter, propertied)
    const { color, rate, width, height} = values
    assertPopulatedString(color)
    assertAboveZero(rate)
    assertAboveZero(width)
    assertAboveZero(height)
    const w = Math.round(width * outputDimensions.width)
    const h = Math.round(width * outputDimensions.height)
    const { ffmpegFilter } = this
    const serverFilter: CommandFilter = {
      ffmpegFilter, options: { color, rate, size: [w, h].join('x') }
    }
    commandFilters.push(serverFilter)
    return chain
  }

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

  phase = Phase.Initialize
}

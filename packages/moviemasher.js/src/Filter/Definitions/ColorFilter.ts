import { SvgContent } from "../../declarations"
import { CommandFilter, CommandFilters, FilterDefinitionArgs, FilterDefinitionCommandFilterArgs } from "../../MoveMe"
import { pixelColor } from "../../Utility/Pixel"
import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { DataType, Phase } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { NamespaceSvg } from "../../Setup/Constants"
import { assertAboveZero, assertPopulatedString, isAboveZero } from "../../Utility/Is"
import { idGenerate } from "../../Utility/Id"
import { PropertyTweenSuffix } from "../../Base/Propertied"

/**
 * @category Filter
 */
export class ColorFilter extends FilterDefinitionClass {
  constructor(...args: any[]) {
    super(...args)
    this.properties.push(propertyInstance({
      tweenable: true, name: 'color', type: DataType.Rgb
    }))
    
    const keys = ['x', 'y', 'width', 'height']
    keys.forEach(name => {
      this.properties.push(propertyInstance({ 
        tweenable: true, name, type: DataType.Number 
      }))
    })
    this.populateParametersFromProperties()
  }

  commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters {
    const commandFilters: CommandFilters = []
    const { filter, videoRate, duration } = args
    assertAboveZero(videoRate, 'videoRate')

    const x = filter.value('x')
    const y = filter.value('y')
    const width = filter.value('width')
    const height = filter.value('height')
    const color = filter.value('color')
    

    
    // make larger rect and crop if x/y > 0 or duration
    // use geq to fade colors
  

    if (duration) {

      const xEnd = filter.value(`x${PropertyTweenSuffix}`)
      const yEnd = filter.value(`y${PropertyTweenSuffix}`)
      const widthEnd = filter.value(`width${PropertyTweenSuffix}`)
      const heightEnd = filter.value(`height${PropertyTweenSuffix}`)
      const colorEnd = filter.value(`color${PropertyTweenSuffix}`)
    }
    

    assertPopulatedString(color)
    assertAboveZero(width, 'width')
    assertAboveZero(height, 'height')
    
    const { ffmpegFilter } = this
    const commandFilter: CommandFilter = {
      inputs: [], ffmpegFilter, 
      options: { color, rate: videoRate, size: [width, height].join('x') },
      outputs: [idGenerate(ffmpegFilter)]
    }
    if (isAboveZero(duration)) commandFilter.options.duration = duration
    commandFilters.push(commandFilter)
    return commandFilters
  }

  filterDefinitionSvg(args: FilterDefinitionArgs): SvgContent {
    const { filter } = args
    const valueObject = filter.scalarObject(false)
    const { x, y, width, height, color } = valueObject
    assertPopulatedString(color)

    const rectElement = globalThis.document.createElementNS(NamespaceSvg, 'rect')
    rectElement.setAttribute('width', String(width))
    rectElement.setAttribute('height', String(height))
    rectElement.setAttribute('x', String(x))
    rectElement.setAttribute('y', String(y))
    rectElement.setAttribute('fill', pixelColor(color))
    return rectElement
  }

  phase = Phase.Initialize
}

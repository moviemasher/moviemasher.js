import { SvgItem, SvgItems } from "../../declarations"
import { CommandFilter, CommandFilters, FilterDefinitionArgs, FilterDefinitionCommandFilterArgs } from "../../MoveMe"
import { pixelColor } from "../../Utility/Pixel"
import { DataType } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { NamespaceSvg } from "../../Setup/Constants"
import { assertAboveZero, assertNumber, assertPopulatedString, isAboveZero, isPopulatedString } from "../../Utility/Is"
import { idGenerate } from "../../Utility/Id"
import { PropertyTweenSuffix } from "../../Base/Propertied"
import { tweenMaxSize, tweenOption, tweenPosition } from "../../Utility/Tween"
import { ColorizeFilter } from "./ColorizeFilter"
import { assertSize } from "../../Utility/Size"

/**
 * @category Filter
 */
export class ColorFilter extends ColorizeFilter {
  constructor(...args: any[]) {
    super(...args)
    this.properties.push(propertyInstance({
      tweenable: true, name: 'color', type: DataType.String
    }))
    
    const keys = ['width', 'height']
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

    const { ffmpegFilter } = this
    let filterInput = idGenerate(ffmpegFilter)
   
    const color = filter.value('color')
    assertPopulatedString(color)

    const colorEnd = duration ? filter.value(`color${PropertyTweenSuffix}`) : undefined
    const tweeningColor = isPopulatedString(colorEnd) && color !== colorEnd
    const scalars = filter.scalarObject(!!duration)
    assertSize(scalars)

    const { width, height } = scalars
  
    let tweeningSize = false
    const startSize = { width, height }
    const endSize = { width, height }
  
    if (duration) {
      const { 
        [`width${PropertyTweenSuffix}`]: widthEnd = width, 
        [`height${PropertyTweenSuffix}`]: heightEnd = height, 
      } = scalars
      assertNumber(widthEnd)
      assertNumber(heightEnd)
      tweeningSize = !(width === widthEnd && height === heightEnd)
      if (tweeningSize) {
        endSize.width = widthEnd
        endSize.height = heightEnd
      }
    }
    const maxSize = tweeningSize ? tweenMaxSize(startSize, endSize) : startSize
    const commandFilter: CommandFilter = {
      inputs: [], ffmpegFilter, 
      options: { 
        color, rate: videoRate, size: Object.values(maxSize).join('x') 
      },
      outputs: [filterInput]
    }
    if (isAboveZero(duration)) commandFilter.options.duration = duration
    commandFilters.push(commandFilter)

    // console.log(this.constructor.name, "commandFilters", tweeningColor, color, colorEnd, duration)

    if (tweeningColor) {
      const fadeFilter = 'fade'
      const fadeFilterId = idGenerate(fadeFilter)
      const fadeCommandFilter: CommandFilter = {
        inputs: [filterInput], ffmpegFilter: fadeFilter, 
        options: { 
          type: 'out',
          color: colorEnd, duration,
        },
        outputs: [fadeFilterId]
      }
      commandFilters.push(fadeCommandFilter)
      filterInput = fadeFilterId
    }

    if (tweeningSize) {
      const scaleFilter = 'scale'
      const scaleFilterId = idGenerate(scaleFilter)
      const position = tweenPosition(videoRate, duration)
      const scaleCommandFilter: CommandFilter = {
        inputs: [filterInput], ffmpegFilter: scaleFilter, 
        options: { 
          eval: 'frame',
          width: tweenOption(startSize.width, endSize.width, position),
          height: tweenOption(startSize.height, endSize.height, position),
        },
        outputs: [scaleFilterId]
      }
      commandFilters.push(scaleCommandFilter)
    }
    return commandFilters
  }
  protected _ffmpegFilter = 'color'

  filterDefinitionSvgs(args: FilterDefinitionArgs): SvgItems {
    const { filter } = args
    const valueObject = filter.scalarObject(false)
    const { width, height, color } = valueObject
    assertPopulatedString(color)

    const rectElement = globalThis.document.createElementNS(NamespaceSvg, 'rect')
    rectElement.setAttribute('width', String(width))
    rectElement.setAttribute('height', String(height))
    rectElement.setAttribute('fill', pixelColor(color))
    return [rectElement]
  }
}

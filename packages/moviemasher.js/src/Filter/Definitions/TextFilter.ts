import { ValueObject } from "../../declarations"
import { DataType, Phase } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { assertNumber, assertPopulatedString, isAboveZero, isNumber, isPopulatedString } from "../../Utility/Is"
import { FilterDefinitionCommandFilterArgs, CommandFilters, CommandFilter } from "../../MoveMe"
import { arrayLast } from "../../Utility/Array"
import { idGenerate } from "../../Utility/Id"
import { PropertyTweenSuffix } from "../../Base/Propertied"
import { tweenOption, tweenPosition } from "../../Utility/Tween"
import { colorBlack, colorBlackOpaque, colorRgbaKeys, colorRgbKeys, colorToRgb, colorToRgba, colorWhite, colorWhiteOpaque, colorWhiteTransparent } from "../../Utility/Color"
import { ColorizeFilter } from "./ColorizeFilter"

/**
 * @category Filter
 */

export class TextFilter extends ColorizeFilter {
  constructor(...args: any[]) {
    super(...args)
    this.properties.push(propertyInstance({
      custom: true, type: DataType.String, name: 'fontfile'
    }))
    this.properties.push(propertyInstance({
      custom: true, type: DataType.String, name: 'textfile'
    }))
    
    this.properties.push(propertyInstance({
      tweenable: true, custom: true, type: DataType.Number, name: 'height'
    }))
    this.properties.push(propertyInstance({
      tweenable: true, custom: true, type: DataType.Number, name: 'width'
    }))
    
    this.properties.push(propertyInstance({
      tweenable: true, custom: true, type: DataType.Number, name: 'x'
    }))

    this.properties.push(propertyInstance({
      tweenable: true, custom: true, type: DataType.String, name: 'color'
    }))
    this.populateParametersFromProperties()
  }

  commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters {
    const commandFilters:CommandFilters = []
    const { filter, duration, videoRate, filterInput: contentOutput } = args

    const color = filter.value('color')
    const x = filter.value('x')
    const textfile = filter.value('textfile')
    const fontfile = filter.value('fontfile')
    const height = filter.value('height')
    const width = filter.value('width')

    assertPopulatedString(textfile)
    assertPopulatedString(fontfile)
    assertNumber(height)
    assertNumber(width)
    assertNumber(x)
    assertPopulatedString(color, 'color')

    const xEnd = filter.value('xEnd')
    const colorEnd = duration ? filter.value(`color${PropertyTweenSuffix}`) : undefined
    const tweeningColor = isPopulatedString(colorEnd) && color !== colorEnd

    const { ffmpegFilter } = this
    const drawtextId = idGenerate(ffmpegFilter)
    
    const alpha = color.length > 7
    const white = alpha ? colorWhiteOpaque : colorWhite
    const black = alpha ? colorBlackOpaque : colorBlack
    const foreColor = (tweeningColor || contentOutput) ? white : color
    const backColor = contentOutput ? black : colorWhiteTransparent 
    
    const heightEnd = duration ? filter.value(`height${PropertyTweenSuffix}`) : undefined
    const widthEnd = duration ? filter.value(`width${PropertyTweenSuffix}`) : undefined

    const colorDimensions = { width, height }

    let tweeningDimensions = false
    
    if (isAboveZero(heightEnd)) {
      tweeningDimensions ||= height !== heightEnd
      colorDimensions.height = Math.max(colorDimensions.height, heightEnd) 
    }
    if (isAboveZero(widthEnd)) {
      tweeningDimensions ||= width !== widthEnd
      colorDimensions.width = Math.max(colorDimensions.width, widthEnd) 
    }
    // colorDimensions.width += 100

    const textOptions: ValueObject = {
      fontsize: colorDimensions.height, fontfile, textfile, 
      x: Math.ceil(isNumber(xEnd) ? Math.max(x, xEnd) : x)
    }
    // console.log(this.constructor.name, "commandFilters", colorDimensions)
    const position = tweenPosition(videoRate, duration)
    if (tweeningColor) {
      const alpha = color.length > 7
      const fromColor = alpha ? colorToRgba(color) : colorToRgb(color)
      const toColor = alpha ? colorToRgba(colorEnd) : colorToRgb(colorEnd)
      const keys = alpha ? colorRgbaKeys : colorRgbKeys
      const calcs = keys.map(key => {
        const from = fromColor[key]
        const to = toColor[key]
        return from === to ? from : `${from}+(${to - from}*${position})`
      })
      const calls = calcs.map(calc => ['eif', calc, 'x', 2].join(':'))
      const expressions = calls.map(call => `%{${call}}`)
      textOptions.fontcolor_expr = `#${expressions.join('')}`
    } else textOptions.fontcolor = foreColor

    const colorCommand = this.colorCommandFilter(colorDimensions, videoRate, duration, backColor)
    commandFilters.push(colorCommand)
    let filterInput = arrayLast(colorCommand.outputs)

    const drawtextFilter: CommandFilter = {
      inputs: [filterInput], ffmpegFilter,
      options: textOptions, outputs: [drawtextId]
    }
    commandFilters.push(drawtextFilter)
    filterInput = drawtextId
    
    const formatFilter = 'format'
    const formatId = idGenerate(formatFilter)
    const formatCommandFilter: CommandFilter = {
      inputs: [filterInput], ffmpegFilter: formatFilter, 
      options: { pix_fmts: 'rgba' }, outputs: [formatId]
    }
    commandFilters.push(formatCommandFilter)
    filterInput = formatId

    if (tweeningDimensions) {
      const scaleFilter = 'scale'
      const scaleFilterId = idGenerate(scaleFilter)
      const scaleCommandFilter: CommandFilter = {
        inputs: [filterInput], ffmpegFilter: scaleFilter, 
        options: { 
          eval: 'frame',
          width: -1, //tweenOption(width, widthEnd, pos, true),
          height: tweenOption(height, heightEnd, position, true),
        },
        outputs: [scaleFilterId]
      }
      commandFilters.push(scaleCommandFilter)
      // filterInput = scaleFilterId
    }
    return commandFilters
  }

  _ffmpegFilter = 'drawtext'

  phase = Phase.Populate
}

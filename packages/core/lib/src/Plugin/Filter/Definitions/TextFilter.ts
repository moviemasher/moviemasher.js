import { ValueRecord } from '../../../Types/Core.js'
import { DataType } from '../../../Setup/Enums.js'
import { propertyInstance } from '../../../Setup/Property.js'
import { assertNumber, assertPopulatedString, isAboveZero, isNumber, isPopulatedString } from '../../../Utility/Is.js'
import { FilterDefinitionCommandFilterArgs, CommandFilters, CommandFilter } from '../../../Base/Code.js'
import { arrayLast } from '../../../Utility/Array.js'
import { idGenerate } from '../../../Utility/Id.js'
import { PropertyTweenSuffix } from '../../../Base/Propertied.js'
import { tweenMaxSize, tweenOption, tweenPosition } from '../../../Mixin/Tweenable/Tween.js'
import { colorToRgb, colorToRgba } from '../../../Helpers/Color/ColorFunctions.js'
import { colorBlack, colorBlackTransparent, colorRgbaKeys, colorRgbKeys, colorWhite, colorWhiteTransparent } from '../../../Helpers/Color/ColorConstants.js'
import { ColorizeFilter } from './ColorizeFilter.js'
import { Size, sizesEqual } from '../../../Utility/Size.js'
import { FilterDefinitionObject } from '../Filter.js'

/**
 * @category Filter
 */
export class TextFilter extends ColorizeFilter {
  constructor(object: FilterDefinitionObject) {
    super(object)
    this.properties.push(propertyInstance({
      custom: true, type: DataType.String, name: 'fontfile'
    }))
    this.properties.push(propertyInstance({
      custom: true, type: DataType.String, name: 'textfile'
    }))
    
    this.properties.push(propertyInstance({
      custom: true, type: DataType.Boolean, name: 'stretch'
    }))
    this.properties.push(propertyInstance({
      tweenable: true, custom: true, type: DataType.Number, name: 'height'
    }))
    this.properties.push(propertyInstance({
      tweenable: true, custom: true, type: DataType.Number, name: 'width'
    }))

    this.properties.push(propertyInstance({
      custom: true, type: DataType.Number, name: 'intrinsicHeight'
    }))
    this.properties.push(propertyInstance({
      custom: true, type: DataType.Number, name: 'intrinsicWidth'
    }))
    
    this.properties.push(propertyInstance({
      tweenable: true, custom: true, type: DataType.Number, name: 'x'
    }))

    this.properties.push(propertyInstance({
      tweenable: true, custom: true, type: DataType.Number, name: 'y'
    }))
    this.properties.push(propertyInstance({
      tweenable: true, custom: true, type: DataType.String, name: 'color'
    }))
    this.populateParametersFromProperties()
  }


  private colorCommandFilter(dimensions: Size, videoRate = 0, duration = 0, color = colorWhiteTransparent): CommandFilter {
    const { width, height } = dimensions
    const transparentFilter = 'color'
    const transparentId = idGenerate(transparentFilter)
    const object: ValueRecord = { color, size: `${width}x${height}` }
    if (videoRate) object.rate = videoRate
    if (duration) object.duration = duration
    const commandFilter: CommandFilter = {
      inputs: [], ffmpegFilter: transparentFilter, 
      options: object,
      outputs: [transparentId]
    }
    return commandFilter
  }


  commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters {
    const commandFilters:CommandFilters = []
    const { filter, duration, videoRate, filterInput: contentOutput } = args

    const color = filter.value('color')
    const x = filter.value('x')
    const y = filter.value('y')
    const textfile = filter.value('textfile')
    const fontfile = filter.value('fontfile')
    const height = filter.value('height')
    const width = filter.value('width')
    const stretch = !!filter.value('stretch')
    const intrinsicWidth = filter.value('intrinsicWidth')
    const intrinsicHeight = filter.value('intrinsicHeight')

    assertPopulatedString(textfile)
    assertPopulatedString(fontfile)
    assertNumber(height)
    assertNumber(width)
    assertNumber(intrinsicWidth)
    assertNumber(intrinsicHeight)
    assertNumber(x)
    assertNumber(y)
    assertPopulatedString(color, 'color')

    const xEnd = filter.value(`x${PropertyTweenSuffix}`)
    const yEnd = filter.value(`y${PropertyTweenSuffix}`)
    const colorEnd = duration ? filter.value(`color${PropertyTweenSuffix}`) : undefined
    const tweeningColor = isPopulatedString(colorEnd) && color !== colorEnd

    const { ffmpegFilter } = this
    const drawtextId = idGenerate(ffmpegFilter)
    
    const foreColor = (tweeningColor || contentOutput) ? colorWhite : color

    let backColor = colorBlack
    if (!contentOutput) {
      backColor = tweeningColor ? colorBlackTransparent : colorWhiteTransparent
    }
 
    const size = { width, height }
    const sizeEnd = { ...size }
    if (duration) {
      const heightEnd = filter.value(`height${PropertyTweenSuffix}`) || 0
      const widthEnd = filter.value(`width${PropertyTweenSuffix}`) || 0
      if (isAboveZero(widthEnd)) sizeEnd.width = widthEnd
      if (isAboveZero(heightEnd)) sizeEnd.height = heightEnd
    }
    const ratio = intrinsicWidth / intrinsicHeight 

    const maxSize = tweenMaxSize(size, sizeEnd)
    const calculatedWidth = Math.round(ratio * maxSize.height)
    //stretch ? { width: Math.round(intrinsicWidth / 100), height: Math.round(intrinsicHeight / 100) } : maxSize

    if (calculatedWidth > maxSize.width) maxSize.width = calculatedWidth

    let scaling = stretch || !sizesEqual(size, sizeEnd)
    const scaleOptions: ValueRecord = {}
    const textOptions: ValueRecord = {
      fontsize: maxSize.height, fontfile, textfile, 
      x: Math.ceil(isNumber(xEnd) ? Math.max(x, xEnd) : x),
      y: Math.ceil(isNumber(yEnd) ? Math.max(y, yEnd) : y),
      // fix_bounds: 1,
    }
    // console.log(this.constructor.name, 'commandFilters', colorSize, maxSize, size, sizeEnd)
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

    const colorCommand = this.colorCommandFilter(maxSize, videoRate, duration, backColor)
    commandFilters.push(colorCommand)
    let filterInput = arrayLast(colorCommand.outputs)

    // console.log(this.constructor.name, 'commandFilters', scaling, stretch)
    if (scaling) {
      scaleOptions.width = stretch ? tweenOption(width, sizeEnd.width, position, true) : -1
      scaleOptions.height = tweenOption(height, sizeEnd.height, position, true)
    
      if (!(isNumber(scaleOptions.width) && isNumber(scaleOptions.height))) {
        scaleOptions.eval = 'frame'
      }
    } 
    const drawtextFilter: CommandFilter = {
      inputs: [filterInput], ffmpegFilter,
      options: textOptions, outputs: [drawtextId]
    }
    commandFilters.push(drawtextFilter)
    filterInput = drawtextId
    
    if (!contentOutput) {   
      const formatFilter = 'format'
      const formatId = idGenerate(formatFilter)
      const formatCommandFilter: CommandFilter = {
        inputs: [filterInput], ffmpegFilter: formatFilter, 
        options: { pix_fmts: 'yuva420p' }, outputs: [formatId]
      }
      commandFilters.push(formatCommandFilter)
      filterInput = formatId
    }
    if (scaling) {
      const scaleFilter = 'scale'
      const scaleFilterId = idGenerate(scaleFilter)
      const scaleCommandFilter: CommandFilter = {
        inputs: [filterInput], ffmpegFilter: scaleFilter, 
        options: scaleOptions,
        outputs: [scaleFilterId]
      }
      commandFilters.push(scaleCommandFilter)
      filterInput = scaleFilterId
    }
    return commandFilters
  }

  protected _ffmpegFilter = 'drawtext'
}

import { ValueObject } from "../../declarations"
import { DataType, Phase } from "../../Setup/Enums"
import { propertyInstance } from "../../Setup/Property"
import { assertNumber, assertPopulatedString, isAboveZero, isNumber, isPopulatedString } from "../../Utility/Is"
import { FilterDefinitionCommandFilterArgs, CommandFilters, CommandFilter } from "../../MoveMe"
import { arrayLast } from "../../Utility/Array"
import { idGenerate } from "../../Utility/Id"
import { PropertyTweenSuffix } from "../../Base/Propertied"
import { tweenMaxSize, tweenOption, tweenPosition } from "../../Utility/Tween"
import { colorBlack, colorBlackOpaque, colorBlackTransparent, colorRgbaKeys, colorRgbKeys, colorToRgb, colorToRgba, colorWhite, colorWhiteOpaque, colorWhiteTransparent } from "../../Utility/Color"
import { ColorizeFilter } from "./ColorizeFilter"
import { sizesEqual } from "../../Utility/Size"

/**
 * @category Filter
 */

const TextFilterOverflow = 1.0
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
    const calculatedWidth = Math.round((TextFilterOverflow * maxSize.height) + (ratio * maxSize.height))
    const colorSize = { ...maxSize } 
    //stretch ? { width: Math.round(intrinsicWidth / 100), height: Math.round(intrinsicHeight / 100) } : maxSize

    if (calculatedWidth > colorSize.width) colorSize.width = calculatedWidth

    let scaling = stretch || !sizesEqual(size, sizeEnd)
    const scaleOptions: ValueObject = {}
    const textOptions: ValueObject = {
      fontsize: colorSize.height, fontfile, textfile, 
      x: Math.ceil(isNumber(xEnd) ? Math.max(x, xEnd) : x),
      y: Math.ceil(isNumber(yEnd) ? Math.max(y, yEnd) : y),
      // fix_bounds: 1,
    }
    // console.log(this.constructor.name, "commandFilters", colorSize, maxSize, size, sizeEnd)
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

    const colorCommand = this.colorCommandFilter(colorSize, videoRate, duration, backColor)
    commandFilters.push(colorCommand)
    let filterInput = arrayLast(colorCommand.outputs)

    if (scaling) {
      scaleOptions.width = stretch ? tweenOption(width, sizeEnd.width, position, true) : -1
      scaleOptions.height = tweenOption(height, sizeEnd.height, position, true)
    
      if (!(isNumber(scaleOptions.width) && isNumber(scaleOptions.height))) {
        scaleOptions.eval = 'frame'

        // const setptsFilter = 'setpts'
        // const setptsFilterId = idGenerate(setptsFilter)
        // const setptsOptions = { expr: 'PTS-STARTPTS' }
        // const setptsCommandFilter: CommandFilter = {
        //   inputs: [filterInput], ffmpegFilter: setptsFilter, 
        //   options: setptsOptions,
        //   outputs: [setptsFilterId]
        // }
        // commandFilters.push(setptsCommandFilter)
        // filterInput = setptsFilterId
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

  _ffmpegFilter = 'drawtext'

  phase = Phase.Populate
}

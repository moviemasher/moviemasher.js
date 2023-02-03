import { ScalarObject, SvgFilters, SvgItems, ValueObject, ValueObjects, ValueObjectsTuple } from "../../../declarations"
import { DataType, GraphFileType, Orientation, Orientations } from "../../../Setup/Enums"
import { propertyInstance } from "../../../Setup/Property"
import { assertNumber, assertPopulatedString, assertTimeRange, isAboveZero, isNumber, isPopulatedString } from "../../../Utility/Is"
import { FilterDefinitionCommandFilterArgs, CommandFilters, CommandFilter, CommandFiles, FilterDefinitionCommandFileArgs, FilterDefinitionArgs, CommandFile } from "../../../MoveMe"
import { arrayLast } from "../../../Utility/Array"
import { idGenerate } from "../../../Utility/Id"
import { PropertyTweenSuffix } from "../../../Base/Propertied"
import { tweenMaxSize, tweenOption, tweenPosition, tweenRects, tweenRectStep } from "../../../Utility/Tween"
import { colorBlack, colorBlackTransparent, colorRgbaKeys, colorRgbKeys, colorToRgb, colorToRgba, colorWhite, colorWhiteTransparent } from "../../../Utility/Color"
import { Size, sizeCopy, sizesEqual } from "../../../Utility/Size"
import { FilterDefinitionClass } from "../FilterDefinitionClass"
import { Rect, Rects } from "../../../Utility/Rect"
import { PointZero } from "../../../Utility/Point"
import { svgGroupElement } from "../../../Utility/Svg"

/**
 * @category Filter
 */
export class DisplaceFilter extends FilterDefinitionClass {
  constructor(...args: any[]) {
    super(...args)
    this.properties.push(propertyInstance({
      custom: true, name: 'color', type: DataType.String, 
    }))
    this.populateParametersFromProperties()
  }

  private colorCommandFilter(dimensions: Size, videoRate = 0, duration = 0, color = colorWhiteTransparent): CommandFilter {
    const { width, height } = dimensions
    const transparentFilter = 'color'
    const transparentId = idGenerate(transparentFilter)
    const object: ValueObject = { color, size: `${width}x${height}` }
    if (videoRate) object.rate = videoRate
    if (duration) object.duration = duration
    const commandFilter: CommandFilter = {
      inputs: [], ffmpegFilter: transparentFilter, 
      options: object,
      outputs: [transparentId]
    }
    return commandFilter
  }

  protected svgTags(orientation: Orientation, position: number, size: Size, rect: Rect): ValueObjectsTuple {
    const tags: ValueObjects = []
    
    tags.push({ tag: 'rect', ...size, ...PointZero })
    const insetH = size.width / 20
    const insetV = size.height / 20

    const halfH = size.width / 2
    const halfRect = { 
      x: insetH, y: insetV, 
      width: halfH - (insetH * 2),
      height: size.height - (insetV * 2),
    }
    tags.push({ tag: 'rect', ...size, ...PointZero, 'fill-opacity': 0.5 })
    tags.push({ tag: 'rect', ...halfRect, 'fill-opacity': 0.0  })
    halfRect.x += halfH
    tags.push({ tag: 'rect', ...halfRect, 'fill-opacity': 1.0  })
    return [[], tags, ]
  }

  commandFiles(args: FilterDefinitionCommandFileArgs): CommandFiles {
    const commandFiles: CommandFiles = []
    const { containerRects, outputSize, clipTime, time, videoRate } = args
  
    const scaledTime = time.scale(videoRate)
    const scaledClipTime = clipTime.scale(videoRate)
    const intersection = scaledClipTime.intersection(scaledTime)
    if (!intersection) return commandFiles

    const { frame, frames } = scaledClipTime

    const times = intersection.frameTimes
    return Orientations.map(orientation => {
      const svgs = times.map(time => {
        const { frame: timeFrame } = time
        const currentFrame = timeFrame - frame
        const position = currentFrame / frames
        const rect = tweenRectStep(...containerRects, currentFrame, frames)

        const [defs, tags] = this.svgTags(orientation, position, outputSize, rect)
        const tagStrings = tags.map(tagObject => {
          const { tag } = tagObject
          assertPopulatedString(tag)

          const bits = [`<${tag}`, ]

          bits.push('/>')
          return bits.join(' ')
        })
        tagStrings.unshift('<svg>')
        tagStrings.push('</svg>')
        
        return tagStrings.join('')
      })

      const commandFile: CommandFile = {
        type: GraphFileType.SvgSequence,
        file: this.id, inputId: `${this.id}-${orientation}`,
        input: true, definition: this,
        content: svgs.join("\n")
      }
      return commandFile
    })
  }

  commandFilters(args: FilterDefinitionCommandFilterArgs): CommandFilters {
    const commandFilters:CommandFilters = []
    const { filter, duration, videoRate, filterInput: contentOutput, commandFiles } = args

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
    const scaleOptions: ValueObject = {}
    const textOptions: ValueObject = {
      fontsize: maxSize.height, fontfile, textfile, 
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

    const colorCommand = this.colorCommandFilter(maxSize, videoRate, duration, backColor)
    commandFilters.push(colorCommand)
    let filterInput = arrayLast(colorCommand.outputs)

    // console.log(this.constructor.name, "commandFilters", scaling, stretch)
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

  filterDefinitionSvgs(args: FilterDefinitionArgs): SvgItems {
    // const { dimensions } = args
    const items: SvgItems = []
    const groupElement = svgGroupElement()
    return items
  }

  filterDefinitionSvgFilter(valueObject: ScalarObject): SvgFilters {
    const filters: SvgFilters = []

    return filters
  }
  protected _ffmpegFilter = 'dislace'
}

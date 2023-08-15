import type { CommandFile, CommandFiles, CommandFilter, CommandFilterArgs, CommandFilters, ServerTextAsset, Tweening, VisibleCommandFileArgs, VisibleCommandFilterArgs } from '@moviemasher/lib-shared'
import type { GraphFile, GraphFiles } from '@moviemasher/runtime-server'
import type { PreloadArgs, ScalarRecord, Size, TextInstance, TextInstanceObject, ValueRecord } from '@moviemasher/runtime-shared'

import { LockNone, ServerInstanceClass, ServerRawAssetClass, ServerTextInstance, ServerVisibleAssetMixin, ServerVisibleInstanceMixin, TextAssetMixin, TextHeight, TextInstanceMixin, VisibleAssetMixin, VisibleInstanceMixin, arrayLast, assertEndpoint, assertNumber, assertPopulatedString, assertTrue, colorBlack, colorBlackTransparent, colorRgbKeys, colorRgbaKeys, colorToRgb, colorToRgba, colorWhite, colorWhiteTransparent, endpointUrl, idGenerate, isAboveZero, isTrueValue, sizesEqual, tweenMaxSize, tweenOption, tweenPosition } from '@moviemasher/lib-shared'
import { EventAsset, GraphFileTypeTxt, MovieMasher } from '@moviemasher/runtime-server'
import { SourceText, POINT_ZERO, End, TypeFont, TypeImage, isAssetObject, isNumber, isPopulatedString } from '@moviemasher/runtime-shared'

const WithAsset = VisibleAssetMixin(ServerRawAssetClass)
const WithServerAsset = ServerVisibleAssetMixin(WithAsset)
const WithTextAsset = TextAssetMixin(WithServerAsset)

export class ServerTextAssetClass extends WithTextAsset implements ServerTextAsset {
  canColor(args: CommandFilterArgs): boolean { return true }

  canColorTween(args: CommandFilterArgs): boolean { return true }

  graphFiles(args: PreloadArgs): GraphFiles {
    const { visible } = args
    if (!visible) return []
    
    const { request } = this
    const { endpoint } = request
    assertEndpoint(endpoint)
    const file = endpointUrl(endpoint) 


    // const file = editing ? url : source
    const graphFile: GraphFile = {
      type: TypeFont, file, definition: this
    }
    return [graphFile]
  }

  instanceFromObject(object?: TextInstanceObject): TextInstance {
    const args = this.instanceArgs(object)
    return new ServerTextInstanceClass(args)
  }

  static handleAsset(event:EventAsset) {
    const { detail } = event
    const { assetObject } = detail
    if (isAssetObject(assetObject, TypeImage, SourceText)) {
      detail.asset = new ServerTextAssetClass(assetObject)
      event.stopImmediatePropagation()
    }
  }
}
// listen for image/text asset event
MovieMasher.eventDispatcher.addDispatchListener(
  EventAsset.Type, ServerTextAssetClass.handleAsset
)

const WithInstance = VisibleInstanceMixin(ServerInstanceClass)
const WithServerInstance = ServerVisibleInstanceMixin(WithInstance)
const WithTextInstance = TextInstanceMixin(WithServerInstance)

export class ServerTextInstanceClass extends WithTextInstance implements ServerTextInstance { 
  declare asset: ServerTextAsset

  initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
    const commandFilters: CommandFilters = [] 
    const { 
      contentColors: colors = [], outputSize, track, filterInput: input,
      containerRects, videoRate, commandFiles, duration
    } = args
  
    let filterInput = input
    // console.log(this.constructor.name, 'initialCommandFilters', filterInput, tweening)

    if (filterInput) {
      commandFilters.push(this.copyCommandFilter(filterInput, track))
    }

    const [rect, rectEnd] = containerRects
    const { height, width } = rect
 
    // console.log(this.constructor.name, 'initialCommandFilters', merging, ...containerRects)
    const maxSize = tweenMaxSize(rect, rectEnd) 

    let colorInput = ''
    const merging = !!filterInput || tweening.size
    if (merging) {
      const backColor = filterInput ? colorBlack : colorBlackTransparent
      const colorArgs: VisibleCommandFilterArgs = { 
        ...args, 
        contentColors: [backColor, backColor], 
        outputSize: maxSize
      }
      commandFilters.push(...this.colorBackCommandFilters(colorArgs))
      colorInput = arrayLast(arrayLast(commandFilters).outputs) 
    }

    const textFile = commandFiles.find(commandFile => (
      commandFile.inputId === this.id && commandFile.type === GraphFileTypeTxt
    ))
    assertTrue(textFile, 'text file') 
    const { resolved: textfile } = textFile
    assertPopulatedString(textfile, 'textfile')

    const fontFile = commandFiles.find(commandFile => (
      commandFile.inputId === this.id && commandFile.type === TypeFont
    ))
    assertTrue(fontFile, 'font file') 
    
    const { resolved: fontfile } = fontFile
    assertPopulatedString(fontfile, 'fontfile')

    const {lock } = this

    const intrinsicRect = this.intrinsicRect()
    const x = intrinsicRect.x * (rect.width / intrinsicRect.width)
    const y = 0 // intrinsicRect.y * (height / intrinsicRect.height)
    const [color = colorWhite, endColor] = colors
    const colorEnd = duration ? endColor || color : undefined
    assertPopulatedString(color)

    const xEnd = intrinsicRect.x * (rectEnd.width / intrinsicRect.width)
    const yEnd = 0 // intrinsicRect.y * (rectEnd.height / intrinsicRect.height)
    // console.log(this.constructor.name, 'initialCommandFilters', lock)
    const intrinsicRatio = TextHeight / intrinsicRect.height
    const textSize = Math.round(height * intrinsicRatio)
    const textSizeEnd = Math.round(rectEnd.height * intrinsicRatio)
    const options: ScalarRecord = { 
      x, y, width, height: textSize, color, textfile, fontfile,
      stretch: lock === LockNone,
      intrinsicHeight: intrinsicRect.height,
      intrinsicWidth: intrinsicRect.width,
    }
    
    if (colorEnd) options[`color${End}`] = colorEnd

    const stretch = lock === LockNone

    const {width: intrinsicWidth, height: intrinsicHeight } = intrinsicRect

    assertPopulatedString(textfile)
    assertPopulatedString(fontfile)
    assertNumber(textSize)
    assertNumber(width)
    assertNumber(intrinsicWidth)
    assertNumber(intrinsicHeight)
    assertNumber(x)
    assertNumber(y)
    assertPopulatedString(color, 'color')

   
    const tweeningColor = isPopulatedString(colorEnd) && color !== colorEnd

    const ffmpegFilter = 'text'
    const drawtextId = idGenerate(ffmpegFilter)
    
    const foreColor = (tweeningColor || filterInput) ? colorWhite : color

    let backColor = colorBlack
    if (!filterInput) {
      backColor = tweeningColor ? colorBlackTransparent : colorWhiteTransparent
    }
 
    const size = { width, height: textSize }
    const sizeEnd = { ...size }
    if (duration) {
      const heightEnd = textSizeEnd || 0
      const widthEnd = rectEnd.width || 0
      if (isAboveZero(widthEnd)) sizeEnd.width = widthEnd
      if (isAboveZero(heightEnd)) sizeEnd.height = heightEnd
    }
    const ratio = intrinsicWidth / intrinsicHeight 

    const maxTweenSize = tweenMaxSize(size, sizeEnd)
    const calculatedWidth = Math.round(ratio * maxTweenSize.height)
    //stretch ? { width: Math.round(intrinsicWidth / 100), height: Math.round(intrinsicHeight / 100) } : maxTweenSize

    if (calculatedWidth > maxTweenSize.width) maxTweenSize.width = calculatedWidth

    const scaling = stretch || !sizesEqual(size, sizeEnd)
    const scaleOptions: ValueRecord = {}
    const textOptions: ValueRecord = {
      fontsize: maxTweenSize.height, fontfile, textfile, 
      x: Math.ceil(isNumber(xEnd) ? Math.max(x, xEnd) : x),
      y: Math.ceil(isNumber(yEnd) ? Math.max(y, yEnd) : y),
      // fix_bounds: 1,
    }
    // console.log(this.constructor.name, 'commandFilters', colorSize, maxTweenSize, size, sizeEnd)
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

    const colorCommand = this.colorCommandFilter(maxTweenSize, videoRate, duration, backColor)
    commandFilters.push(colorCommand)
    filterInput = arrayLast(colorCommand.outputs)
    assertPopulatedString(filterInput, 'filterInput')
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
    
    if (!filterInput) {   
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



    // commandFilters.push(...textFilter.commandFilters(textArgs))
    
    if (merging) {
      filterInput = arrayLast(arrayLast(commandFilters).outputs)
      assertPopulatedString(filterInput, 'overlay filterInput')
      commandFilters.push(...this.overlayCommandFilters(colorInput, filterInput))

      filterInput = arrayLast(arrayLast(commandFilters).outputs) 
      assertPopulatedString(filterInput, 'crop filterInput')

      const options: ValueRecord = { exact: 1, ...POINT_ZERO }
      const cropOutput = idGenerate('crop')
      const { width, height } = maxSize
      if (isTrueValue(width)) options.w = width
      if (isTrueValue(height)) options.h = height
      const commandFilter: CommandFilter = {
        ffmpegFilter: 'crop', 
        inputs: [filterInput], 
        options, 
        outputs: [cropOutput]
      }
      commandFilters.push(commandFilter)
    } 
    return commandFilters
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


  visibleCommandFiles(args: VisibleCommandFileArgs): CommandFiles {
    const files = super.visibleCommandFiles(args)
    const { string, asset: definition } = this
    const textGraphFile: CommandFile = {
      definition, type: GraphFileTypeTxt, 
      file: this.id, inputId: this.id,
      content: string, 
    }
    files.push(textGraphFile)
    return files
  }
}


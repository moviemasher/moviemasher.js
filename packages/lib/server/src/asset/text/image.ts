import type { Tweening, } from '@moviemasher/lib-shared'
import type { GraphFile, GraphFiles, ServerMediaRequest, ServerPromiseArgs } from '@moviemasher/runtime-server'
import type { AssetCacheArgs, DataOrError, InstanceArgs, PreloadArgs, Rect, ScalarRecord, Size, Strings, TextAssetObject, TextInstanceObject, ValueRecord } from '@moviemasher/runtime-shared'
import type { CommandFile, CommandFileArgs, CommandFiles, CommandFilter, CommandFilterArgs, CommandFilters, VisibleCommandFileArgs, VisibleCommandFilterArgs } from '@moviemasher/runtime-server'
import type { ServerTextAsset, ServerTextInstance } from '../../Types/ServerTypes.js'

import { DOT, EqualsChar, LockNone, NewlineChar, TextAssetMixin, TextHeight, TextInstanceMixin, VisibleAssetMixin, VisibleInstanceMixin, arrayLast, arrayOfNumbers, assertNumber, assertPopulatedString, assertRect, assertTrue, colorBlack, colorBlackTransparent, colorRgbKeys, colorRgbaKeys, colorToRgb, colorToRgba, colorWhite, colorWhiteTransparent, idGenerate, isAboveZero, isPopulatedArray, isTrueValue, pointAboveZero, sizeAboveZero, sizesEqual, tweenMaxSize, tweenOption, tweenPosition } from '@moviemasher/lib-shared'
import { EventServerAsset, EventServerAssetPromise, EventServerTextRect, GraphFileTypeTxt, MovieMasher } from '@moviemasher/runtime-server'
import { End, ERROR, POINT_ZERO, RECT_KEYS, RECT_ZERO, SourceText, TypeFont, IMAGE, errorThrow, isAssetObject, isDefiniteError, isNumber, isPopulatedString, POINT_KEYS, SIZE_KEYS, isBoolean, errorPromise } from '@moviemasher/runtime-shared'
import { execSync } from 'child_process'
import { ServerInstanceClass } from '../../Base/ServerInstanceClass.js'
import { ServerRawAssetClass } from '../../Base/ServerRawAssetClass.js'
import { ServerVisibleAssetMixin } from '../../Base/ServerVisibleAssetMixin.js'
import { ServerVisibleInstanceMixin } from '../../Base/ServerVisibleInstanceMixin.js'
import { fileReadPromise, fileRemove, fileRemovePromise, fileTemporaryPath, fileWrite, fileWritePromise } from '../../Utility/File.js'
import { hashMd5 } from '../../Utility/Hash.js'
import { commandFilesInput } from '../../Utility/CommandFilesFunctions.js'

const WithAsset = VisibleAssetMixin(ServerRawAssetClass)
const WithServerAsset = ServerVisibleAssetMixin(WithAsset)
const WithTextAsset = TextAssetMixin(WithServerAsset)
export class ServerTextAssetClass extends WithTextAsset implements ServerTextAsset {
  constructor(args: TextAssetObject) {
    super(args)
    this.initializeProperties(args)
  }
  
  override assetCachePromise(args: AssetCacheArgs): Promise<DataOrError<number>> {
    const { request } = this
    const event = new EventServerAssetPromise(request, TypeFont)
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    if (!promise) return errorPromise(ERROR.Unimplemented, EventServerAssetPromise.Type)
   
    return promise.then(orError => {
      // return errorPromise(ERROR.Ffmpeg, 'assetCachePromise')

      // console.log(this.constructor.name, 'ServerTextAssetClass.assetCachePromise', orError)
      if (isDefiniteError(orError)) return orError

      return { data: 1 }
    })
  }

  canColor(_args: CommandFilterArgs): boolean { return true }

  canColorTween(_args: CommandFilterArgs): boolean { return true }

  graphFiles(args: PreloadArgs): GraphFiles {
    const { visible } = args
    if (!visible) return []
    
    const { request } = this
    const { path: file } = request
    assertPopulatedString(file)
    const graphFile: GraphFile = { type: TypeFont, file, definition: this }
    return [graphFile]
  }

  instanceFromObject(object?: TextInstanceObject): ServerTextInstance {
    const args = this.instanceArgs(object)
    return new ServerTextInstanceClass(args)
  }

  override serverPromise(args: ServerPromiseArgs, commandFile: CommandFile): Promise<DataOrError<number>> {
    const { visible } = args
    if (!visible) return Promise.resolve( { data: 0 })

    const { input, file, content, type } = commandFile
    if (!input && type === GraphFileTypeTxt && content) {
      return fileWritePromise(file, content).then(() => ({ data: 0 }))
    }
    return super.serverPromise(args, commandFile)
  }


  static handleAsset(event:EventServerAsset) {
    const { detail } = event
    const { assetObject } = detail
    if (isAssetObject(assetObject, IMAGE, SourceText)) {
      detail.asset = new ServerTextAssetClass(assetObject)
      event.stopImmediatePropagation()
    }
  }
  static handleTextRect(event:EventServerTextRect) {
    const { detail } = event
    const { text, font, height } = detail
    detail.rect = ServerTextAssetClass.textRect(text, font, height)
    event.stopImmediatePropagation()
  }

  private static textRect(text: string, fontPath: string, charHeight: number): Rect {
    const fileName = hashMd5(`${fontPath}/${text}`)
    const textFile = fileTemporaryPath(fileName, GraphFileTypeTxt)
    fileWrite(textFile, text)
    
    let multiplier = 2 
    let rect: Rect = { ... RECT_ZERO }

    const indices = arrayOfNumbers(3)
    indices.find(index => {
      const { length: textLength } = text
      const charWidth = charHeight * (1 + index)
      const command = ServerTextAssetClass.probeCommand(textFile, fontPath, charHeight, charWidth, textLength, multiplier)
      const probeRect = ServerTextAssetClass.probeRect(command)
      
      if (!sizeAboveZero(probeRect)) return false

      if (!pointAboveZero(probeRect)) {
        multiplier++
        return false
      }
      
      const { 
        x: actualX, y: actualY, width: actualWidth, height: actualHeight 
      } = probeRect
      const width = charWidth * textLength * multiplier
      const height = charHeight * multiplier
      const expectedX = Math.ceil((width - actualWidth) / 2) 
      const x = actualX - expectedX
      const expectedY = Math.ceil((height - actualHeight) / 2)
      const y = actualY - expectedY
      rect = { ...probeRect, x, y }
      return true
    })
    fileRemove(textFile)
    return rect
  }

  private static probeRect(command: string): Rect {
    const rect: Rect = { ...RECT_ZERO }
    try {
      const result = execSync(command).toString().trim()
      result.split(NewlineChar).forEach(string => {
        const [key, value] = string.split(EqualsChar)
        const number = Number(value.trim())
        const char = arrayLast(key.split(DOT))
        switch(char) {
          case POINT_KEYS[0]:
          case POINT_KEYS[1]:
            rect[char] = number
            break
          default: {
            const key = SIZE_KEYS.find(key => key.startsWith(char))
            if (key) rect[key] = number
          }
        }
      })
      // console.log('ServerTextAssetClass.probeRect', rect, result, command)
    }
    catch(error) { 
      
      console.error('ServerTextAssetClass.probeRect', error)
      execSync(command.slice(0, -('-v quiet'.length)))
    }
    
    return rect
  }

  private static probeCommand(textPath: string, fontPath: string, charHeight: number, charWidth: number, textLength: number, multiplier: number) {
    const filters: Strings = []
    const width = charWidth * textLength * multiplier
    const height = charHeight * multiplier
    filters.push(`color=size=${width}x${height}:duration=1:rate=1:color=black`)
    filters.push(`drawtext=fontfile=${fontPath}:textfile=${textPath}:fontsize=${charHeight}:fontcolor=red:boxcolor=white:x=(w-text_w)/2:y=(h-text_h)/2`)
    filters.push(`cropdetect=mode=black:skip=0`)
    // metadata=mode=print

    // color=size=320x240:duration=1:rate=1:color=black,drawtext=fontfile=temporary/test-server/1fe02cf3faae3032e16727ff06364759.ttf:fontsize=30:fontcolor=red:x=(w-text_w)/2:y=(h-text_h)/2:textPath=Stack:box=1:boxcolor=white,cropdetect=mode=black:skip=0,metadata=mode=print

    const tags = RECT_KEYS.map(key => `lavfi.cropdetect.${key[0]}`).join(',')

    const words = [
      'ffprobe -f lavfi',
      `"${filters.join(',')}"`,
      `-show_entries frame_tags=${tags}`,
      '-of default=noprint_wrappers=1 -v quiet', //:nokey=1
    ]
    return words.join(' ')
  }
}

// listen for image/text asset event
export const ServerTextImageListeners = () => ({
  [EventServerAsset.Type]: ServerTextAssetClass.handleAsset,
  [EventServerTextRect.Type]: ServerTextAssetClass.handleTextRect,
})

const WithInstance = VisibleInstanceMixin(ServerInstanceClass)
const WithServerInstance = ServerVisibleInstanceMixin(WithInstance)
const WithTextInstance = TextInstanceMixin(WithServerInstance)
export class ServerTextInstanceClass extends WithTextInstance implements ServerTextInstance { 
  constructor(args: TextInstanceObject & InstanceArgs) {
    super(args)
    this.initializeProperties(args)
  }
  
  declare asset: ServerTextAsset
  
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


  override containerCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
    const commandFilters: CommandFilters = [] 
    const { 
      contentColors: colors, commandFiles, filterInput: input 
    } = args

    let filterInput = input
    // console.log(this.constructor.name, 'containerCommandFilters', filterInput)


    const noContentFilters = isPopulatedArray(colors)
    const alpha = this.requiresAlpha(args, !!tweening.size)

    //  console.log(this.constructor.name, 'containerCommandFilters', {filterInput, alpha, noContentFilters})

    if (alpha) {
      assertPopulatedString(filterInput, 'container input')
      const { contentColors: _, ...argsWithoutColors } = args
      const superArgs: VisibleCommandFilterArgs = { 
        ...argsWithoutColors, filterInput
      }
      commandFilters.push(...super.containerCommandFilters(superArgs, tweening))
    } else if (noContentFilters) {
      const { id } = this
      if (!filterInput) console.log(this.constructor.name, 'containerCommandFilters calling commandFilesInput', id)
      
      filterInput ||= commandFilesInput(commandFiles, id, true)
      assertPopulatedString(filterInput, 'final input')
      
      commandFilters.push(...this.containerFinalCommandFilters({ ...args, filterInput}))
    }
    return commandFilters
  }
  
  
  override initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
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

    const ffmpegFilter = 'drawtext'
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


  override intrinsicRect(_ = false): Rect { 
    return this.intrinsic ||= this.intrinsicRectInitialize()
  }

  private intrinsicRectInitialize(): Rect {
    const { asset, string } = this
    if (!string) return { width: 0, height: TextHeight, ...POINT_ZERO }

    const request = asset.request as ServerMediaRequest
    const { path: file } = request
    assertPopulatedString(file)

    const event = new EventServerTextRect(string, file, TextHeight)
    MovieMasher.eventDispatcher.dispatch(event)
    const { rect } = event.detail
    // console.log(this.constructor.name, 'intrinsicRectInitialize', rect)

    assertRect(rect)

    return rect
  }

  private isTweeningColor(args: CommandFileArgs): boolean {
    const { contentColors } = args
    // assertPopulatedArray(contentColors, 'contentColors')
    if (!isPopulatedArray(contentColors)) return false

    const [forecolor, forecolorEnd] = contentColors
    return contentColors.length === 2 && forecolor !== forecolorEnd
  }


  private requiresAlpha(args: CommandFileArgs, tweeningSize?: boolean): boolean {
    const { contentColors } = args
    const colorContent = isPopulatedArray(contentColors)
    if (!colorContent) return true // always need to mask content

    return this.isTweeningColor(args)
  }
  

  override visibleCommandFiles(args: VisibleCommandFileArgs): CommandFiles {
    const files = super.visibleCommandFiles(args)
    const { string: content, asset: definition, id: inputId } = this
    // console.log(this.constructor.name, 'visibleCommandFiles', inputId)
    const file = fileTemporaryPath(inputId, GraphFileTypeTxt)
    const textGraphFile: CommandFile = {
      type: GraphFileTypeTxt, definition, file, inputId, content, 
    }
    files.push(textGraphFile)
    return files
  }
}

import type { Tweening, } from '@moviemasher/lib-shared'
import type { GraphFile, GraphFiles, ServerMediaRequest, ServerPromiseArgs } from '@moviemasher/runtime-server'
import type { AssetCacheArgs, DataOrError, InstanceArgs, CacheArgs, Rect, Size, Strings, TextAssetObject, TextInstanceObject, ValueRecord, StringTuple } from '@moviemasher/runtime-shared'
import type { CommandFile, CommandFileArgs, CommandFiles, CommandFilter, CommandFilterArgs, CommandFilters, VisibleCommandFileArgs, VisibleCommandFilterArgs } from '@moviemasher/runtime-server'
import type { ServerTextAsset, ServerTextInstance } from '../../Types/ServerTypes.js'

import { DOT, EQUALS, LockNone, NEWLINE, TextAssetMixin, TextExtension, TextHeight, TextInstanceMixin, VisibleAssetMixin, VisibleInstanceMixin, arrayLast, arrayOfNumbers, assertPopulatedString, assertRect, assertTrue, colorBlack, colorBlackTransparent, colorRgbKeys, colorRgbaKeys, colorToRgb, colorToRgba, colorWhite, colorWhiteTransparent, idGenerate, isPopulatedArray, pointAboveZero, sizeAboveZero, sizeEven, tweenMaxSize, tweenOption, tweenPosition } from '@moviemasher/lib-shared'
import { EventServerAsset, EventServerAssetPromise, EventServerTextRect, GraphFileTypeTxt, MovieMasher } from '@moviemasher/runtime-server'
import { ERROR, POINT_ZERO, RECT_KEYS, RECT_ZERO, TEXT, FONT, IMAGE, isAssetObject, isDefiniteError, isNumber, isPopulatedString, POINT_KEYS, SIZE_KEYS, errorPromise } from '@moviemasher/runtime-shared'
import { execSync } from 'child_process'
import { ServerInstanceClass } from '../../Base/ServerInstanceClass.js'
import { ServerRawAssetClass } from '../../Base/ServerRawAssetClass.js'
import { ServerVisibleAssetMixin } from '../../Base/ServerVisibleAssetMixin.js'
import { ServerVisibleInstanceMixin } from '../../Base/ServerVisibleInstanceMixin.js'
import { filePathExists, fileWrite, fileWritePromise } from '../../Utility/File.js'
import { hashMd5 } from '../../Utility/Hash.js'
import { commandFilesInput } from '../../Utility/CommandFilesFunctions.js'
import { ENV, ENVIRONMENT } from '../../Environment/EnvironmentConstants.js'
import path from 'path'

const WithAsset = VisibleAssetMixin(ServerRawAssetClass)
const WithServerAsset = ServerVisibleAssetMixin(WithAsset)
const WithTextAsset = TextAssetMixin(WithServerAsset)
export class ServerTextAssetClass extends WithTextAsset implements ServerTextAsset {
  constructor(args: TextAssetObject) {
    super(args)
    this.initializeProperties(args)
  }
  
  override assetCachePromise(args: AssetCacheArgs): Promise<DataOrError<number>> {
    const { validDirectories } = args
    const { request } = this
    const event = new EventServerAssetPromise(request, FONT, validDirectories)
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    if (!promise) return errorPromise(ERROR.Unimplemented, EventServerAssetPromise.Type)
   
    return promise.then(orError => {
      if (isDefiniteError(orError)) return orError
      // console.log(this.constructor.name, 'ServerTextAssetClass.assetCachePromise', orError)

      return { data: 1 }
    })
  }


  assetGraphFiles(args: CacheArgs): GraphFiles {
    const { visible } = args
    if (!visible) return []
    
    const { request } = this
    const { path: file } = request
    assertPopulatedString(file)

    const graphFile: GraphFile = { type: FONT, file, definition: this }
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
      return fileWritePromise(file, content, true).then(() => ({ data: 0 }))
    }
    return super.serverPromise(args, commandFile)
  }

  static handleAsset(event:EventServerAsset) {
    const { detail } = event
    const { assetObject } = detail
    if (isAssetObject(assetObject, IMAGE, TEXT)) {
      detail.asset = new ServerTextAssetClass(assetObject)
      event.stopImmediatePropagation()
    }
  }

  static handleTextRect(event:EventServerTextRect) {
    const { detail } = event
    const { text, font, height } = detail
    detail.rect = ServerTextAssetClass.textRect(text, font, height)
    // console.log('ServerTextAssetClass.handleTextRect', detail.rect, {text, font, height})
    event.stopImmediatePropagation()
  }

  private static probeCommand(textPath: string, fontPath: string, charHeight: number, width: number, height: number) {
    const filters: Strings = []
    const baseline = Math.round(height / 2) 
    const left = Math.round(width / 4) 
    filters.push(`color=size=${width}x${height}:duration=1:rate=1:color=black`)
    filters.push(`drawtext=y_align=baseline:fontfile=${fontPath}:textfile=${textPath}:fontsize=${charHeight}:fontcolor=yellow:box=1:boxcolor=white:x=${left}:y=${baseline}`)
    filters.push(`cropdetect=mode=black:skip=0`)
    // metadata=mode=print
    const tags = RECT_KEYS.map(key => `lavfi.cropdetect.${key[0]}`).join(',')
    const words = [
      'ffprobe -f lavfi',
      `"${filters.join(',')}"`,
      `-show_entries frame_tags=${tags}`,
      '-of default=noprint_wrappers=1 -v quiet', //:nokey=1
    ]
    return words.join(' ')
  }

  private static probeRect(command: string): Rect {
    const rect: Rect = { ...RECT_ZERO }
    try {
      const result = execSync(command).toString().trim()
      result.split(NEWLINE).forEach(string => {
        const [key, value] = string.split(EQUALS)
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

  private static textRect(text: string, fontPath: string, charHeight: number): Rect {
    const fileName = hashMd5(text)
    const directory = ENVIRONMENT.get(ENV.ApiDirCache)
    const name = [fileName, DOT, TextExtension].join('')
    const textFile = path.resolve(directory, name)
    if (!filePathExists(textFile)) fileWrite(textFile, text)
    let multiplier = 2 
    let rect: Rect = { ...RECT_ZERO }
    const indices = arrayOfNumbers(3)
    indices.find(index => {
      const { length: textLength } = text
      const charWidth = charHeight * (1 + index)
      const width = charWidth * textLength * multiplier
      const height = charHeight * multiplier
      const left = Math.round(width / 4) 
      const baseline = Math.round(height / 2) 
      const command = ServerTextAssetClass.probeCommand(textFile, fontPath, charHeight, width, height)
      const probeRect = ServerTextAssetClass.probeRect(command)
      if (!sizeAboveZero(probeRect)) return false

      if (!pointAboveZero(probeRect)) {
        multiplier++
        return false
      }
      const { x, y } = probeRect
      rect = { ...probeRect, x: x - left, y: baseline - y }
      return true
    })
    // fileRemove(textFile)
    return rect
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
  
  override canColor(_args: CommandFilterArgs): boolean { return true }

  override canColorTween(_args: CommandFilterArgs): boolean { return true }

  private colorCommandFilter(dimensions: Size, videoRate = 0, duration = 0, color = colorWhiteTransparent): CommandFilter {
    const { width, height } = dimensions
    const transparentFilter = 'color'
    const transparentId = idGenerate('transparent')
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

    // console.log(this.constructor.name, 'containerCommandFilters', {filterInput, alpha, noContentFilters})

    if (alpha) {
      assertPopulatedString(filterInput, 'container input')
      const { contentColors: _, ...argsWithoutColors } = args
      const superArgs: VisibleCommandFilterArgs = { 
        ...argsWithoutColors, filterInput
      }
      commandFilters.push(...this.instanceCommandFilters(superArgs, tweening))
    } else if (noContentFilters) {
      const { id } = this
      // if (!filterInput) console.log(this.constructor.name, 'containerCommandFilters calling commandFilesInput', id)
      
      filterInput ||= commandFilesInput(commandFiles, id, true)
      assertPopulatedString(filterInput, 'final input')
      
      commandFilters.push(...this.containerFinalCommandFilters({ ...args, filterInput}))
    }
    return commandFilters
  }

  private findCommandFiles(commandFiles: CommandFiles): StringTuple {
    const textFile = commandFiles.find(commandFile => (
      commandFile.inputId === this.id && commandFile.type === GraphFileTypeTxt
    ))
    assertTrue(textFile, 'text file') 
    const { resolved: textfile } = textFile
    assertPopulatedString(textfile, 'textfile')

    const fontFile = commandFiles.find(commandFile => (
      commandFile.inputId === this.id && commandFile.type === FONT
    ))
    assertTrue(fontFile, 'font file') 
    
    const { resolved: fontfile } = fontFile
    assertPopulatedString(fontfile, 'fontfile')

    return [textfile, fontfile]
  }
  
  override initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
    const commandFilters:CommandFilters = []
    const { duration, videoRate, filterInput: contentOutput, commandFiles,  filterInput: input, } = args
    const { contentColors: colors = [], track, containerRects } = args
    const alpha = this.requiresAlpha(args, !!tweening.size)
    const contentInput = `content-${track}`
    const containerInput = `container-${track}`
    const textInput = `text-${track}`
    let filterInput = input 

    if (!tweening.canColor) {
      if (isPopulatedString(filterInput)) {
        if (alpha) {
          const formatFilter = 'format'
          const formatFilterId = idGenerate(formatFilter)
          const formatCommandFilter: CommandFilter = {
            inputs: [filterInput], ffmpegFilter: formatFilter, 
            options: { pix_fmts: 'yuv420p' },
            outputs: [formatFilterId]
          }
          commandFilters.push(formatCommandFilter)
          filterInput = formatFilterId
        }
      }
    }

    if (commandFilters.length) arrayLast(commandFilters).outputs = [contentInput]
    else if (isPopulatedString(filterInput) && contentInput !== filterInput) {
      commandFilters.push(this.copyCommandFilter(filterInput, track))
      filterInput = arrayLast(arrayLast(commandFilters).outputs)  
    }
    const { lock } = this
    const [color = colorWhite, endColor] = colors
    const stretch = lock === LockNone
    const {
      width: intrinsicWidth, height: intrinsicHeight,
      x: intrinsicX, 
      // y: intrinsicY,
    } = this.intrinsicRect() 
    const intrinsicY = 0
    const [rect, rectEnd] = containerRects
    const size = sizeEven(rect)
    const sizeEnd = sizeEven(rectEnd)
    const maxSize = sizeEven(tweenMaxSize(...containerRects))
    const { height, width } = size
    const { width: widthEnd, height: heightEnd } = sizeEnd

    const x = intrinsicX * (width / intrinsicWidth)
    const y =  intrinsicY * (height / intrinsicHeight)
    const intrinsicRatio = TextHeight / intrinsicHeight

    const [textfile, fontfile] = this.findCommandFiles(commandFiles)
    assertPopulatedString(textfile)
    assertPopulatedString(fontfile)

    const xEnd = intrinsicX * (widthEnd / intrinsicWidth)
    const yEnd =  intrinsicY * (heightEnd / intrinsicHeight)

    const colorEnd = duration ? endColor : undefined
    const tweeningColor = tweening.color// isPopulatedString(colorEnd) && color !== colorEnd

    const ffmpegFilter = 'drawtext'
    const drawtextId = idGenerate(ffmpegFilter)
    
    const fontColor = (tweeningColor || contentOutput) ? colorWhite : color

    let backColor = colorBlack
    if (!contentOutput) {
      backColor = tweeningColor ? colorBlackTransparent : colorWhiteTransparent
    }
    

    const calculatedWidth = Math.round(intrinsicRatio * maxSize.height)
    if (calculatedWidth > maxSize.width) maxSize.width = calculatedWidth
  
    const scaling = stretch || tweening.size //!sizesEqual(size, sizeEnd)
    const fontsize = Math.round(height * intrinsicRatio)
    const fontsizeEnd = Math.round(rectEnd.height * intrinsicRatio)
    const textOptions: ValueRecord = {
      fontsize, fontfile, textfile, 
      x: Math.ceil(isNumber(xEnd) ? Math.max(x, xEnd) : x),
      y: Math.ceil(isNumber(yEnd) ? Math.max(y, yEnd) : y),
      // box: 1,
      // boxcolor: 'black',
      // y_align: 'baseline',
      // fix_bounds: 1,
    }
    // console.log(this.constructor.name, "commandFilters", colorSize, maxSize, size, sizeEnd)
    const position = tweenPosition(videoRate, duration)
    if (tweeningColor) {
      const alpha = color.length > 7
      const fromColor = alpha ? colorToRgba(color) : colorToRgb(color)
      const toColor = alpha ? colorToRgba(colorEnd!) : colorToRgb(colorEnd!)
      const keys = alpha ? colorRgbaKeys : colorRgbKeys
      const calcs = keys.map(key => {
        const from = fromColor[key]
        const to = toColor[key]
        return from === to ? from : `${from}+(${to - from}*${position})`
      })
      const calls = calcs.map(calc => ['eif', calc, 'x', 2].join(':'))
      const expressions = calls.map(call => `%{${call}}`)
      textOptions.fontcolor_expr = `#${expressions.join('')}`
    } else textOptions.fontcolor = fontColor

    const colorArgs: VisibleCommandFilterArgs = { 
      ...args, contentColors: [backColor, backColor], outputSize: maxSize
    }

    if (contentOutput || scaling) commandFilters.push(...this.colorBackCommandFilters(colorArgs, `${textInput}-back`))

    commandFilters.push(...this.colorBackCommandFilters(colorArgs, `${containerInput}-back`))
    filterInput = arrayLast(arrayLast(commandFilters).outputs) 
   
    const drawtextFilter: CommandFilter = {
      inputs: [filterInput], ffmpegFilter,
      options: textOptions, outputs: [drawtextId]
    }
    commandFilters.push(drawtextFilter)
    filterInput = drawtextId
 

    if (alpha || scaling) {
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
      const scaleOptions: ValueRecord = {}
      scaleOptions.width = stretch ? tweenOption(width, widthEnd, position, true) : -1
      scaleOptions.height = tweenOption(height, fontsizeEnd, position, true)
    
      if (!(isNumber(scaleOptions.width) && isNumber(scaleOptions.height))) {
        scaleOptions.eval = 'frame'
      }
    
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
    if (contentOutput || scaling) commandFilters.push(...this.overlayCommandFilters(`${textInput}-back`, filterInput))
    // filterInput = arrayLast(arrayLast(commandFilters).outputs) 
 
    return commandFilters
  }

  // private initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
  //   const commandFilters: CommandFilters = [] 
  //   const rectIntrinsic = this.intrinsicRect()
  //   const {
  //     width: intrinsicWidth, height: intrinsicHeight,
  //     x: intrinsicX, y: intrinsicY,
  //    } = rectIntrinsic

  //   const ratio = intrinsicWidth / intrinsicHeight 

  //   const { 
  //     contentColors: colors = [], outputSize, track, filterInput: contentOutput,
  //     containerRects, videoRate, commandFiles, duration
  //   } = args

  //   let filterInput = contentOutput
  //   // console.log(this.constructor.name, 'initialCommandFilters', filterInput, tweening)

  //   if (filterInput) {
  //     commandFilters.push(this.copyCommandFilter(filterInput, track))
  //   }

  //   const [rect, rectEnd] = containerRects
  //   const { height, width } = rect
 
  //   const maxSize = tweenMaxSize(rect, rectEnd) 
  //   const calculatedWidth = Math.round(ratio * maxSize.height)

  //   if (calculatedWidth > maxSize.width) maxSize.width = calculatedWidth

  //   let colorInput = ''
  //   const merging = !!filterInput || tweening.size
  //   // console.log(this.constructor.name, 'initialCommandFilters', merging, tweening)

  //   if (merging) {
  //     const backColor = filterInput ? colorBlack : colorBlackTransparent
  //     const colorArgs: VisibleCommandFilterArgs = { 
  //       ...args, 
  //       contentColors: [backColor, backColor], 
  //       outputSize: maxSize
  //     }
  //     commandFilters.push(...this.colorBackCommandFilters(colorArgs))
  //     colorInput = arrayLast(arrayLast(commandFilters).outputs) 
  //   }

  //   const textFile = commandFiles.find(commandFile => (
  //     commandFile.inputId === this.id && commandFile.type === GraphFileTypeTxt
  //   ))
  //   assertTrue(textFile, 'text file') 
  //   const { resolved: textfile } = textFile
  //   assertPopulatedString(textfile, 'textfile')

  //   const fontFile = commandFiles.find(commandFile => (
  //     commandFile.inputId === this.id && commandFile.type === FONT
  //   ))
  //   assertTrue(fontFile, 'font file') 
    
  //   const { resolved: fontfile } = fontFile
  //   assertPopulatedString(fontfile, 'fontfile')

  //   const {lock } = this

 
  //   const x = intrinsicX * (rect.width / intrinsicWidth)
  //   const y =  intrinsicY * (height / intrinsicHeight)


  //   const [color = colorWhite, endColor] = colors
  //   const colorEnd = duration ? endColor || color : undefined
  //   assertPopulatedString(color)

  //   const xEnd = intrinsicX * (rectEnd.width / intrinsicWidth)
  //   const yEnd =  intrinsicY * (rectEnd.height / intrinsicHeight)
  //   // console.log(this.constructor.name, 'initialCommandFilters', lock)
  //   const intrinsicRatio = TextHeight / intrinsicHeight
  //   const textSize = Math.round(height * intrinsicRatio)
  //   const textSizeEnd = Math.round(rectEnd.height * intrinsicRatio)
  //   const options: ScalarRecord = { 
  //     x, y, width, height: textSize, color, textfile, fontfile,
  //     stretch: lock === LockNone,
  //     intrinsicHeight: intrinsicHeight,
  //     intrinsicWidth: intrinsicWidth,
  //   }
    
  //   if (colorEnd) options[`color${END}`] = colorEnd

  //   const stretch = lock === LockNone


  //   assertPopulatedString(textfile)
  //   assertPopulatedString(fontfile)
  //   assertNumber(textSize)
  //   assertNumber(width)
  //   assertNumber(intrinsicWidth)
  //   assertNumber(intrinsicHeight)
  //   assertNumber(x)
  //   assertNumber(y)
  //   assertPopulatedString(color, 'color')

   
  //   const tweeningColor = isPopulatedString(colorEnd) && color !== colorEnd

  //   const ffmpegFilter = 'drawtext'
  //   const drawtextId = idGenerate(ffmpegFilter)
    
  //   const foreColor = (tweeningColor || filterInput) ? colorWhite : color

  //   let backColor = colorBlack
  //   if (!filterInput) {
  //     backColor = tweeningColor ? colorBlackTransparent : colorWhiteTransparent
  //   }
 
  //   const size = { width, height: textSize }
  //   const sizeEnd = { ...size }
  //   if (duration) {
  //     const heightEnd = textSizeEnd || 0
  //     const widthEnd = rectEnd.width || 0
  //     if (isAboveZero(widthEnd)) sizeEnd.width = widthEnd
  //     if (isAboveZero(heightEnd)) sizeEnd.height = heightEnd
  //   }

  //   const maxTweenSize = tweenMaxSize(size, sizeEnd)

    
  //   // console.log(this.constructor.name, 'initialCommandFilters', maxTweenSize, maxSize)
  //   // const calculatedTweenWidth = Math.round(ratio * maxTweenSize.height)
  //   //stretch ? { width: Math.round(intrinsicWidth / 100), height: Math.round(intrinsicHeight / 100) } : maxTweenSize

  //   // if (calculatedTweenWidth > maxTweenSize.width) maxTweenSize.width = calculatedTweenWidth

  //   const scaling = stretch || !sizesEqual(size, sizeEnd)
  //   const scaleOptions: ValueRecord = {}
  //   const textOptions: ValueRecord = {
  //     fontsize: maxSize.height, fontfile, textfile, 
  //     x: Math.ceil(isNumber(xEnd) ? Math.max(x, xEnd) : x),
  //     y: Math.ceil(isNumber(yEnd) ? Math.max(y, yEnd) : y),
  //     y_align: 'baseline',
  //     // fix_bounds: 1,
  //   }
  //   // console.log(this.constructor.name, 'commandFilters', colorSize, maxTweenSize, size, sizeEnd)
  //   const position = tweenPosition(videoRate, duration)
  //   if (tweeningColor) {
  //     const alpha = color.length > 7
  //     const fromColor = alpha ? colorToRgba(color) : colorToRgb(color)
  //     const toColor = alpha ? colorToRgba(colorEnd) : colorToRgb(colorEnd)
  //     const keys = alpha ? colorRgbaKeys : colorRgbKeys
  //     const calcs = keys.map(key => {
  //       const from = fromColor[key]
  //       const to = toColor[key]
  //       return from === to ? from : `${from}+(${to - from}*${position})`
  //     })
  //     const calls = calcs.map(calc => ['eif', calc, 'x', 2].join(':'))
  //     const expressions = calls.map(call => `%{${call}}`)
  //     textOptions.fontcolor_expr = `#${expressions.join('')}`
  //   } else textOptions.fontcolor = foreColor

  //   const colorCommand = this.colorCommandFilter(maxSize, videoRate, duration, backColor)
  //   commandFilters.push(colorCommand)
  //   filterInput = arrayLast(colorCommand.outputs)
  //   assertPopulatedString(filterInput, 'filterInput')
  //   // console.log(this.constructor.name, 'commandFilters', scaling, stretch)
  //   if (scaling) {
  //     scaleOptions.width = stretch ? tweenOption(width, sizeEnd.width, position, true) : -1
  //     scaleOptions.height = tweenOption(height, sizeEnd.height, position, true)
    
  //     if (!(isNumber(scaleOptions.width) && isNumber(scaleOptions.height))) {
  //       scaleOptions.eval = 'frame'
  //     }
  //   } 
  //   const drawtextFilter: CommandFilter = {
  //     inputs: [filterInput], ffmpegFilter,
  //     options: textOptions, outputs: [drawtextId]
  //   }
  //   commandFilters.push(drawtextFilter)
  //   filterInput = drawtextId
    
  //   if (!filterInput) {   
  //     const formatFilter = 'format'
  //     const formatId = idGenerate(formatFilter)
  //     const formatCommandFilter: CommandFilter = {
  //       inputs: [filterInput], ffmpegFilter: formatFilter, 
  //       options: { pix_fmts: 'yuva420p' }, outputs: [formatId]
  //     }
  //     commandFilters.push(formatCommandFilter)
  //     filterInput = formatId
  //   }
  //   if (scaling) {
  //     const scaleFilter = 'scale'
  //     const scaleFilterId = idGenerate(scaleFilter)
  //     const scaleCommandFilter: CommandFilter = {
  //       inputs: [filterInput], ffmpegFilter: scaleFilter, 
  //       options: scaleOptions,
  //       outputs: [scaleFilterId]
  //     }
  //     commandFilters.push(scaleCommandFilter)
  //     filterInput = scaleFilterId
  //   }



  //   // commandFilters.push(...textFilter.commandFilters(textArgs))
    
  //   if (merging) {
  //     filterInput = arrayLast(arrayLast(commandFilters).outputs)
  //     assertPopulatedString(filterInput, 'overlay filterInput')
  //     commandFilters.push(...this.overlayCommandFilters(colorInput, filterInput))

  //     filterInput = arrayLast(arrayLast(commandFilters).outputs) 
  //     assertPopulatedString(filterInput, 'crop filterInput')

  //     const options: ValueRecord = { exact: 1, ...POINT_ZERO }
  //     const cropOutput = idGenerate('crop')
  //     const { width, height } = maxSize
  //     if (isTrueValue(width)) options.w = width
  //     if (isTrueValue(height)) options.h = height
  //     const commandFilter: CommandFilter = {
  //       ffmpegFilter: 'crop', 
  //       inputs: [filterInput], 
  //       options, 
  //       outputs: [cropOutput]
  //     }
  //     commandFilters.push(commandFilter)
  //   } 
  //   return commandFilters
  // }


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

    const directory = ENVIRONMENT.get(ENV.ApiDirCache)
    const fileName = hashMd5(content)
    const type = GraphFileTypeTxt
    const file = path.resolve(directory, [fileName, DOT, type].join(''))
    const textGraphFile: CommandFile = {
      type, definition, file, inputId, content, 
    }
    files.push(textGraphFile)
    return files
  }
}

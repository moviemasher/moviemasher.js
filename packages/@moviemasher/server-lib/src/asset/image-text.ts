import type { AssetCacheArgs, CacheArgs, ComplexSvgItem, DataOrError, InstanceArgs, ListenersFunction, Rect, ServerMediaRequest, Strings, SvgItem, SvgItemArgs, TextAssetObject, TextInstanceObject } from '@moviemasher/shared-lib/types.js'
import type { ServerTextAsset, ServerTextInstance, Tweening } from '../type/ServerTypes.js'
import type { CommandFilterArgs, CommandFilters, AssetFile, AssetFiles, VisibleCommandFilterArgs } from '../types.js'

import { TextAssetMixin, TextInstanceMixin } from '@moviemasher/shared-lib/mixin/text.js'
import { VisibleAssetMixin, VisibleInstanceMixin } from '@moviemasher/shared-lib/mixin/visible.js'
import { DOT, EQUALS, ERROR, FONT, IMAGE, MOVIEMASHER, NEWLINE, POINT_ZERO, RECT_KEYS, RECT_ZERO, TEXT, TEXT_HEIGHT, TXT, arrayLast, arrayOfNumbers, errorPromise, errorThrow, isAssetObject, isDefiniteError, isPopulatedString } from '@moviemasher/shared-lib/runtime.js'
import { assertPopulatedString, assertRect, isComplexSvgItem, isServerMediaRequest } from '@moviemasher/shared-lib/utility/guards.js'
import { pointAboveZero, sizeAboveZero } from '@moviemasher/shared-lib/utility/rect.js'
import { svgStyle } from '@moviemasher/shared-lib/utility/svg.js'
import { execSync } from 'child_process'
import path from 'path'
import { ServerRawAssetClass } from '../base/asset-raw.js'
import { ServerInstanceClass } from '../base/instance.js'
import { ServerVisibleAssetMixin, ServerVisibleInstanceMixin } from '../mixin/visible.js'
import { EventServerAsset, EventServerMediaPromise, EventServerTextRect } from '../runtime.js'
import { ENV, ENV_KEY } from '../utility/EnvironmentConstants.js'
import { fileNameFromContent, filePathExists, fileWrite } from '../utility/File.js'

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
    const event = new EventServerMediaPromise(request, FONT, validDirectories)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    if (!promise) return errorPromise(ERROR.Unimplemented, EventServerMediaPromise.Type)
   
    return promise.then(orError => {
      if (isDefiniteError(orError)) return orError
      
      return { data: 1 }
    })
  }

  override assetFiles(args: CacheArgs): AssetFiles {
    const { visible } = args
    if (!visible) return []
    
    const { request } = this
    const { path: file } = request
    assertPopulatedString(file)
    
    const assetFile: AssetFile = { type: FONT, file, asset: this } // not input!
    return [assetFile]
  }

  override instanceFromObject(object?: TextInstanceObject): ServerTextInstance {
    const args = this.instanceArgs(object)
    return new ServerTextInstanceClass(args)
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
    // y_align=baseline:
    filters.push(`drawtext=fontfile=${fontPath}:textfile=${textPath}:fontsize=${charHeight}:fontcolor=yellow:box=1:boxcolor=white:x=${left}:y=${baseline}`)
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
          case 'x':
          case 'y':
            rect[char] = number
            break
          case 'w': {
            rect.width = number
            break
          }
          case 'h': {
            rect.height = number
            break
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
    const fileName = fileNameFromContent(text)
    const directory = ENV.get(ENV_KEY.ApiDirCache)
    const name = [fileName, DOT, TXT].join('')
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

  override containerCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
    const commandFilters: CommandFilters = [] 
    // const { size: tweeningSize } = tweening
    // const { 
    //   contentColors, filterInput: input, ...rest
    // } = args
    // let filterInput = input
    // const alpha = this.textRequiresAlpha(args, tweeningSize)
    // if (alpha) {
    //   assertPopulatedString(filterInput, 'container input')

    //   const superArgs: VisibleCommandFilterArgs = { ...rest, filterInput }
    //   commandFilters.push(...this.instanceCommandFilters(superArgs, tweening))
    // } else if (contentColors?.length) {
    //   filterInput ||= [this.id, 'v'].join(COLON)
    //   assertPopulatedString(filterInput, 'final input')
      
    //   commandFilters.push(...this.containerFinalCommandFilters({ ...args, filterInput}))
    // }
    return commandFilters
  }

  override containerSvgItem(args: SvgItemArgs): DataOrError<SvgItem | ComplexSvgItem> {
    // console.log(this.constructor.name, 'ServerTextInstanceClass.containerSvgItem', args)
    const superItem = super.containerSvgItem(args)
    if (isDefiniteError(superItem)) {
      console.error(this.constructor.name, 'ServerTextInstanceClass.containerSvgItem', superItem.error)
      return superItem
    }
    const { data: item } = superItem
    const complex = isComplexSvgItem(item) ? item : { svgItem: item }
    if (!complex.style) {
      const { request, id, label: family = FONT } = this.asset
      // const family = [FONT, fileNameFromContent(id)].join('')
      if (isServerMediaRequest(request)) {
        const { path: source } = request
        if (isPopulatedString(source)) {
          const destination = path.join(this.asset.fontDirectory, path.basename(source))
          const style = `@font-face { font-family: ${family}; src: url('${destination}'); } text { font-family: ${family}; }`
          // console.log(this.constructor.name, 'ServerTextInstanceClass.containerSvgItem', {style})
          complex.style = svgStyle(style)
        } else {
          console.error('ServerTextInstanceClass.containerSvgItem', 'no source', request)
        }

      } else {
        console.error('ServerTextInstanceClass.containerSvgItem', 'not server request', request)
      }
    } else {
      console.error('ServerTextInstanceClass.containerSvgItem', 'already has style', complex)
    }
    return { data: complex }
  }
  // private findCommandFiles(commandFiles: CommandFiles): Strings {
  //   const svgFile = commandFiles.find(commandFile => (
  //     commandFile.inputId === this.id && commandFile.type === SVG
  //   ))
  //   assertTrue(svgFile, 'svg file') 
  //   const { source: svgfile } = svgFile
  //   assertPopulatedString(svgfile, 'svgfile')

  //   const textFile = commandFiles.find(commandFile => (
  //     commandFile.inputId === this.id && commandFile.type === TXT
  //   ))
  //   assertTrue(textFile, 'text file') 
  //   const { source: textfile } = textFile
  //   assertPopulatedString(textfile, 'textfile')
  //   const fontFile = commandFiles.find(commandFile => (
  //     commandFile.inputId === this.id && commandFile.type === FONT
  //   ))
  //   assertTrue(fontFile, 'font file') 
    
  //   const { source: fontfile } = fontFile
  //   assertPopulatedString(fontfile, 'fontfile')

  //   return [fontfile, svgfile, textfile]
  // }
  
  override initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
    errorThrow(ERROR.Unimplemented, 'initialCommandFilters')

    
    // const commandFilters:CommandFilters = []
    // const { 
    //   duration, videoRate, filterInput: contentOutput, commandFiles,  filterInput: input, 
    //   contentColors = [], track, containerRects
    // } = args
    // const [fontfile, svgfile, textfile] = this.findCommandFiles(commandFiles)
    // assertPopulatedString(textfile)
    // assertPopulatedString(fontfile)
    // assertPopulatedString(svgfile)
    
    // const contentInput = `content-${track}`
    // const containerInput = `container-${track}`
    // const textInput = `text-${track}`
    
    // const { size: tweeningSize, color: tweeningColor, canColor } = tweening
    // const alpha = this.textRequiresAlpha(args, tweeningSize)
    // let filterInput = input 
    // if (!canColor && isPopulatedString(filterInput) && alpha) {
    //   const formatFilter = 'format'
    //   const formatFilterId = idGenerate(formatFilter)
    //   const formatCommandFilter: CommandFilter = {
    //     inputs: [filterInput], ffmpegFilter: formatFilter, 
    //     options: { pix_fmts: 'yuv420p' },
    //     outputs: [formatFilterId]
    //   }
    //   commandFilters.push(formatCommandFilter)
    //   filterInput = formatFilterId
    // }

    // if (commandFilters.length) arrayLast(commandFilters).outputs = [contentInput]
    // else if (isPopulatedString(filterInput) && contentInput !== filterInput) {
    //   commandFilters.push(this.copyCommandFilter(filterInput, track))
    //   filterInput = arrayLast(arrayLast(commandFilters).outputs)  
    // }

    // const {
    //   width: intrinsicWidth, height: intrinsicHeight,
    //   x: intrinsicX, 
    //   // y: intrinsicY,
    // } = this.intrinsicRect 
    // const intrinsicY = 0

    // const [rect, rectEnd] = containerRects

    // const intrinsicRatio = TEXT_HEIGHT / intrinsicHeight
    // const size = sizeEven(rect)
    // const { height, width } = size
    // const sizeEnd = sizeEven(rectEnd)
    // const { width: widthEnd, height: heightEnd } = sizeEnd
    // const xEnd = intrinsicX * (widthEnd / intrinsicWidth)
    // const yEnd =  intrinsicY * (heightEnd / intrinsicHeight)
    // const x = intrinsicX * (width / intrinsicWidth)
    // const y =  intrinsicY * (height / intrinsicHeight)
    // const fontsize = Math.round(height * intrinsicRatio)
    // const textOptions: ValueRecord = {
    //   fontsize, fontfile, textfile, 
    //   x: Math.ceil(isNumber(xEnd) ? Math.max(x, xEnd) : x),
    //   y: Math.ceil(isNumber(yEnd) ? Math.max(y, yEnd) : y),
    // }
    // const position = tweenPosition(videoRate, duration)
    // const [color = RGB_WHITE, endColor] = contentColors
    // if (tweeningColor) {
    //   const alpha = color.length > 7
    //   const fromColor = alpha ? colorToRgba(color) : colorToRgb(color)
    //   const colorEnd = duration ? endColor : undefined
    //   const toColor = alpha ? colorToRgba(colorEnd!) : colorToRgb(colorEnd!)
    //   const keys = alpha ? RGBA_KEYS : RGB_KEYS
    //   const calcs = keys.map(key => {
    //     const from = fromColor[key]
    //     const to = toColor[key]
    //     return from === to ? from : `${from}+(${to - from}*${position})`
    //   })
    //   const calls = calcs.map(calc => ['eif', calc, 'x', 2].join(':'))
    //   const expressions = calls.map(call => `%{${call}}`)
    //   textOptions.fontcolor_expr = `#${expressions.join('')}`
    // } else textOptions.fontcolor = (tweeningColor || contentOutput) ? RGB_WHITE : color


    // const maxSize = sizeEven(tweenMaxSize(...containerRects))
    // const calculatedWidth = Math.round(intrinsicRatio * maxSize.height)
    // if (calculatedWidth > maxSize.width) maxSize.width = calculatedWidth
      
    // let backColor = RGB_BLACK
    // if (!contentOutput) {
    //   backColor = tweeningColor ? RGBA_BLACK_ZERO : RGBA_WHITE_ZERO
    // }
    // const colorArgs: VisibleCommandFilterArgs = { 
    //   ...args, contentColors: [backColor, backColor], outputSize: maxSize
    // }

    // const stretch = this.lock === NONE
    // const scaling = stretch || tweeningSize 
    
    // if (contentOutput || scaling) {
    //   commandFilters.push(...this.colorBackCommandFilters(colorArgs, `${textInput}-back`))
    // }
    // commandFilters.push(...this.colorBackCommandFilters(colorArgs, `${containerInput}-back`))
    // filterInput = arrayLast(arrayLast(commandFilters).outputs) 
    // const ffmpegFilter = 'drawtext'
    // const drawtextId = idGenerate(ffmpegFilter)
    // const drawtextFilter: CommandFilter = {
    //   inputs: [filterInput], ffmpegFilter,
    //   options: textOptions, outputs: [drawtextId]
    // }
    // commandFilters.push(drawtextFilter)
    // filterInput = drawtextId

    //     if (alpha || scaling) {
    //   const formatFilter = 'format'
    //   const formatId = idGenerate(formatFilter)
    //   const formatCommandFilter: CommandFilter = {
    //     inputs: [filterInput], ffmpegFilter: formatFilter, 
    //     options: { pix_fmts: 'yuva420p' }, outputs: [formatId]
    //   }
    //   commandFilters.push(formatCommandFilter)
    //   filterInput = formatId
    // } 

    // if (scaling) {
    //   const fontsizeEnd = Math.round(rectEnd.height * intrinsicRatio)

    //   const scaleOptions: ValueRecord = {}
    //   scaleOptions.width = stretch ? tweenOption(width, widthEnd, position, true) : -1
    //   scaleOptions.height = tweenOption(height, fontsizeEnd, position, true)
    
    //   if (!(isNumber(scaleOptions.width) && isNumber(scaleOptions.height))) {
    //     scaleOptions.eval = FRAME
    //   }
    
    //   const scaleFilter = 'scale'
    //   const scaleFilterId = idGenerate(scaleFilter)
    //   const scaleCommandFilter: CommandFilter = {
    //     inputs: [filterInput], ffmpegFilter: scaleFilter, 
    //     options: scaleOptions,
    //     outputs: [scaleFilterId]
    //   }
    //   commandFilters.push(scaleCommandFilter)
    //   filterInput = scaleFilterId
    // }
    // if (contentOutput || scaling) commandFilters.push(...this.overlayCommandFilters(`${textInput}-back`, filterInput))
 
    // return commandFilters
  }

  override get intrinsicRect(): Rect { 
    return this.intrinsic ||= this.intrinsicRectInitialize()
  }

  private intrinsicRectInitialize(): Rect {
    const { asset, string } = this
    if (!string) return { width: 0, height: TEXT_HEIGHT, ...POINT_ZERO }

    const request = asset.request as ServerMediaRequest
    const { path: file } = request
    assertPopulatedString(file)

    const event = new EventServerTextRect(string, file, TEXT_HEIGHT)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    const { rect } = event.detail
    console.log(this.constructor.name, 'intrinsicRectInitialize', rect)

    assertRect(rect)

    return rect
  }

  // private isTweeningColor(args: VisibleCommandFilterArgs): boolean {
  //   const { contentColors } = args
  //   if (!isPopulatedArray(contentColors)) return false

  //   const [forecolor, forecolorEnd] = contentColors
  //   return contentColors.length === 2 && forecolor !== forecolorEnd
  // }

  // private textRequiresAlpha(args: VisibleCommandFilterArgs, tweeningSize?: boolean): boolean {
  //   return false
  //   // const { contentColors } = args
  //   // const colorContent = isPopulatedArray(contentColors)
  //   // if (!colorContent) return true // always need to mask content

  //   // return this.isTweeningColor(args)
  // }

  // TODO: remove once we're totally done with drawtext
  // override visibleCommandFiles(args: VisibleCommandFileArgs, content?: VisibleContentInstance): CommandFiles {
  //   assertServerVisibleInstance(content)
  //   console.log(this.constructor.name, 'visibleCommandFiles', this.asset.label, 'with content', content.asset.label)

  //   const commandFiles = super.visibleCommandFiles(args, content) // font file, svgs
    
  //   const { string, asset, id: inputId } = this
  //   const directory = ENV.get(ENV_KEY.ApiDirCache)
  //   const fileName = fileNameFromContent(string)

  //   const textPath = path.resolve(directory, [fileName, TXT].join(DOT))
  //   const textFile: CommandFile = {
  //     type: TXT, asset, source: textPath, inputId, content: string, 
  //   }
  //   commandFiles.push(textFile)
  //   return commandFiles
  // }
}

// listen for image/text asset event
export const ServerTextImageListeners: ListenersFunction = () => ({
  [EventServerAsset.Type]: ServerTextAssetClass.handleAsset,
  [EventServerTextRect.Type]: ServerTextAssetClass.handleTextRect,
})

import type { Tweening } from '@moviemasher/lib-shared'
import type { GraphFile, ServerAsset } from '@moviemasher/runtime-server'
import type { IntrinsicOptions, CacheArgs, Size, Value, ValueRecord } from '@moviemasher/runtime-shared'
import type { CommandFile, CommandFileArgs, CommandFiles, CommandFilter, CommandFilterArgs, CommandFilters, VisibleCommandFileArgs, VisibleCommandFilterArgs } from '@moviemasher/runtime-server'
import type { ServerInstance } from '../Types/ServerInstanceTypes.js'

import { InstanceClass, arrayLast, assertAboveZero, assertArray, assertNumber, assertObject, assertPopulatedArray, assertPopulatedString, assertRect, assertSize, assertTimeRange, colorBlackOpaque, colorRgbKeys, colorRgbaKeys, colorToRgb, colorToRgba, colorWhite, idGenerate, isAboveZero, isBelowOne, isTimeRange, sizeEven, sizesEqual, timeFromArgs, tweenMaxSize, tweenOption, tweenPosition } from '@moviemasher/lib-shared'
import { ERROR, errorThrow, isDefined, isNumber, isPopulatedString } from '@moviemasher/runtime-shared'
import { commandFilesInput } from '../Utility/CommandFilesFunctions.js'

export class ServerInstanceClass extends InstanceClass implements ServerInstance {
  alphamergeCommandFilters(args: CommandFilterArgs): CommandFilters {
    const { videoRate, track, filterInput } = args
    const chainInput = `content-${track}`
    assertAboveZero(videoRate)

    assertPopulatedString(chainInput, 'chainInput')
    assertPopulatedString(filterInput, 'filterInput')

    const ffmpegFilter = 'alphamerge'
    const commandFilter: CommandFilter = {
      ffmpegFilter, 
      inputs: [chainInput, filterInput], 
      options: {}, 
      outputs: [idGenerate(ffmpegFilter)]
    }
    return [commandFilter]
  }

  amixCommandFilters(args: CommandFilterArgs): CommandFilters {
    const { chainInput, filterInput } = args
    assertPopulatedString(chainInput)
    assertPopulatedString(filterInput)

    const commandFilter: CommandFilter = {
      ffmpegFilter: 'amix',
      inputs: [chainInput, filterInput],
      options: { normalize: 0 }, outputs: []
    }
    return [commandFilter]
  }

  declare asset: ServerAsset


  audibleCommandFiles(args: CommandFileArgs): CommandFiles {
    const graphFileArgs: CacheArgs = { audible: true }
    return this.fileCommandFiles(graphFileArgs)
  }

  audibleCommandFilters(args: CommandFilterArgs): CommandFilters {
    const commandFilters: CommandFilters = []
    const { time, quantize, commandFiles, clipTime } = args
    const timeDuration = time.isRange ? time.lengthSeconds : 0
    const duration = timeDuration ? Math.min(timeDuration, clipTime!.lengthSeconds) : 0

    // console.log(this.constructor.name, 'audibleCommandFilters', {time, clipTime, duration, timeDuration})

    const { id } = this
    // console.log(this.constructor.name, 'audibleCommandFilters calling commandFilesInput', commandFiles.length)
    let filterInput = commandFilesInput(commandFiles, id, false)

    const trimFilter = 'atrim'
    const trimId = idGenerate(trimFilter)
    const trimOptions: ValueRecord = {}

    const { frame } = this.assetTime(time)

    if (duration) trimOptions.duration = duration
    if (frame) trimOptions.start = timeFromArgs(frame, quantize).seconds

    const commandFilter: CommandFilter = {
      inputs: [filterInput],
      ffmpegFilter: trimFilter,
      options: trimOptions,
      outputs: [trimId]
    }
    commandFilters.push(commandFilter)
    filterInput = trimId

    const delays = (clipTime!.seconds - time.seconds) * 1000
    if (delays) {
      const adelayFilter = 'adelay'
      const adelayId = idGenerate(adelayFilter)
      const adelayCommandFilter: CommandFilter = {
        ffmpegFilter: adelayFilter,
        options: { delays, all: 1 },
        inputs: [filterInput], outputs: [adelayId]
      }
      commandFilters.push(adelayCommandFilter)
      filterInput = adelayId
    }
    commandFilters.push(...this.amixCommandFilters({ ...args, filterInput }))
    return commandFilters
  }

  canColor(args: CommandFilterArgs): boolean { return false }

  canColorTween(args: CommandFilterArgs): boolean { return false }

  colorBackCommandFilters(args: VisibleCommandFilterArgs, output?: string, intrinsicSize?: Size): CommandFilters {
    const outputString = output || idGenerate('back')
    const { contentColors = [], videoRate, outputSize, duration } = args
    assertSize(outputSize)
    const evenSize = sizeEven(outputSize)
    const [color = colorBlackOpaque, colorEnd = colorBlackOpaque] = contentColors
  
    // console.log(this.constructor.name, 'colorBackCommandFilters', {color, colorEnd})
    const commandFilters: CommandFilters = []
    

    if (sizesEqual(evenSize, outputSize)) {
      commandFilters.push(...this.colorCommandFilters(duration, videoRate, evenSize, evenSize, color, colorEnd))
      const lastFilter = arrayLast(commandFilters)
      // console.log(this.constructor.name, 'colorBackCommandFilters', 'sizesEqual', evenSize, outputSize, 'SET', lastFilter.outputs, '=', outputString)
      lastFilter.outputs = [outputString]
    } else {
      const doubleSize = { width: evenSize.width * 2, height: evenSize.height * 2 }
      commandFilters.push(...this.colorCommandFilters(duration, videoRate, evenSize, evenSize, color, colorEnd))
      const filterInput = arrayLast(arrayLast(commandFilters).outputs)
      assertPopulatedString(filterInput, 'crop input')

      const cropCommandFilter: CommandFilter = {
        inputs: [filterInput], ffmpegFilter: 'crop',
        options: { w: outputSize.width, h: outputSize.height },//, exact: 1
        outputs: [outputString]
      }
      commandFilters.push(cropCommandFilter)
    }
    return commandFilters
  }

  colorCommandFilters(duration: number, videoRate: number, rect: Size, rectEnd: Size, color: Value, colorTween: Value): CommandFilters {
    const commandFilters: CommandFilters = []
    assertAboveZero(videoRate, 'videoRate')
    assertPopulatedString(color)

    const colorEnd = duration ? colorTween : undefined
    const tweeningColor = isPopulatedString(colorEnd) && color !== colorEnd

    const { width, height } = rect
  
    let tweeningSize = false
    const startSize = { width, height }
    const endSize = { width, height }
  
    if (duration) {
      const { 
        width: widthEnd = width, 
        height: heightEnd = height, 
      } = rectEnd
      assertNumber(widthEnd)
      assertNumber(heightEnd)
      tweeningSize = !(width === widthEnd && height === heightEnd)
      if (tweeningSize) {
        endSize.width = widthEnd
        endSize.height = heightEnd
      }
    }
    const maxSize = sizeEven(tweeningSize ? tweenMaxSize(startSize, endSize) : startSize)
    const ffmpegFilter = 'color'
    let filterInput = idGenerate(ffmpegFilter)
    const commandFilter: CommandFilter = {
      inputs: [], ffmpegFilter, 
      options: { 
        color, rate: videoRate, size: Object.values(maxSize).join('x') 
      },
      outputs: [filterInput]
    }
    if (isAboveZero(duration)) commandFilter.options.duration = duration
    commandFilters.push(commandFilter)

    // console.log(this.constructor.name, 'colorCommandFilters', {filterInput, tweeningColor, tweeningSize, duration})

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

  colorizeCommandFilters(args: CommandFilterArgs): CommandFilters {
    const { contentColors: colors, videoRate, time, filterInput: input } = args
    let filterInput = input
    assertPopulatedString(filterInput, 'filterInput')
    assertPopulatedArray(colors)

    const duration = isTimeRange(time) ? time.lengthSeconds : 0
    const [color, endColor] = colors
    const colorEnd = endColor || color
    assertPopulatedString(color, 'color')
    assertPopulatedString(colorEnd)

    const commandFilters: CommandFilters = []
    const formatFilter = 'format'
    const formatId = idGenerate(formatFilter)
    const formatCommandFilter: CommandFilter = {
      inputs: [filterInput], ffmpegFilter: formatFilter, 
      options: { pix_fmts: 'rgba' }, outputs: [formatId]
    }
    commandFilters.push(formatCommandFilter)
    filterInput = formatId

    const alpha = color.length > 7
    const fromColor = alpha ? colorToRgba(color) : colorToRgb(color)
    const toColor = alpha ? colorToRgba(colorEnd) : colorToRgb(colorEnd)

    const keys = alpha ? colorRgbaKeys : colorRgbKeys
    const options: ValueRecord = {}

    const position = duration ? tweenPosition(videoRate, duration, 'N') : 0

    keys.forEach(key => {
      const from = fromColor[key]
      const to = toColor[key]
      if (from === to) options[key] = from
      else options[key] = `${from}+(${to - from}*${position})`
    })
    if (!alpha) options.a = 'alpha(X,Y)'

    const geqFilter = 'geq'
    const geqFilterId = idGenerate(geqFilter)
    const geqCommandFilter: CommandFilter = {
      inputs: [filterInput], ffmpegFilter: geqFilter, 
      options, outputs: [geqFilterId]
    }
    commandFilters.push(geqCommandFilter)
    return commandFilters
  }

  colorMaximize = false

  commandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container = false): CommandFilters {
    // console.log(this.constructor.name, 'commandFilters', container, tweening, args)
    const filters: CommandFilters = []
    const { filterInput: input = '' } = args
    let filterInput = input
    // console.log(this.constructor.name, 'commandFilters', container, args.commandFiles.length)
    const initialFilters = this.initialCommandFilters(args, tweening, container)
    if (initialFilters.length) {
      filters.push(...initialFilters)
      filterInput = arrayLast(arrayLast(initialFilters).outputs)
    }
    // console.log(this.constructor.name, 'commandFilters', container, initialFilters)
    if (container)
      filters.push(...this.containerCommandFilters({ ...args, filterInput }, tweening))
    else
      filters.push(...this.contentCommandFilters({ ...args, filterInput }, tweening))
    return filters
  }

  containerColorCommandFilters(args: VisibleCommandFilterArgs): CommandFilters {
    const commandFilters: CommandFilters = []
    const { contentColors: colors = [], containerRects, videoRate, duration, track } = args
    assertArray(containerRects, 'containerRects')
    const [rect, rectEnd] = containerRects

    const [color = colorWhite, colorEnd = colorWhite] = colors
 
    // console.log(this.constructor.name, this.assetId, 'containerColorCommandFilters', {color, colorEnd})
    commandFilters.push(...this.colorCommandFilters(duration, videoRate, rect, rectEnd, color, colorEnd))
    return commandFilters
    // const { colorMaximize } = this
    // if (!colorMaximize) return commandFilters

    // const maxSize = tweenMaxSize(rect, rectEnd) 
    // const filterArgs: VisibleCommandFilterArgs = {
    //   ...args, outputSize: maxSize
    // }

    // const colorInput = `content-${track}`
    // console.log(this.constructor.name, 'ServerInstanceClass.containerColorCommandFilters calling colorBackCommandFilters', colorInput)
    // commandFilters.push(...this.colorBackCommandFilters(filterArgs, colorInput))

    // return commandFilters
  }

  containerCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
    return this.instanceCommandFilters(args, tweening)
  }

  protected instanceCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
    // console.log(this.constructor.name, 'ServerInstanceClass.containerCommandFilters')
    const commandFilters: CommandFilters = []
    const { contentColors, filterInput: input } = args
    let filterInput = input
    // console.log(this.constructor.name, 'containerCommandFilters', filterInput)
    assertPopulatedString(filterInput, 'filterInput')

    if (!tweening.canColor){ //} contentColors?.length) {
      const mergeFilters = this.alphamergeCommandFilters({ ...args, filterInput })
      
      commandFilters.push(...mergeFilters)
      filterInput = arrayLast(arrayLast(commandFilters).outputs)
      // console.log(this.constructor.name, 'containerCommandFilters no contentColors', mergeFilters, filterInput)

    }

    commandFilters.push(...this.containerFinalCommandFilters({ ...args, filterInput }))
    return commandFilters
  }

  containerFinalCommandFilters(args: VisibleCommandFilterArgs): CommandFilters {
    const commandFilters: CommandFilters = []
    const { filterInput: input } = args

    let filterInput = input
    assertPopulatedString(filterInput, 'filterInput')

    const opacityFilters = this.opacityCommandFilters(args)
    if (opacityFilters.length) {
      commandFilters.push(...opacityFilters)
      filterInput = arrayLast(arrayLast(opacityFilters).outputs)
    }
    // console.debug(this.constructor.name, 'containerFinalCommandFilters', opacityFilters.length)
    commandFilters.push(...this.translateCommandFilters({ ...args, filterInput }))

    return commandFilters
  }


  // containerCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters { 
  //   // console.log(this.constructor.name, 'containerCommandFilters returning empty')
  //   return [] 
  // }
  // containerFinalCommandFilters(args: VisibleCommandFilterArgs): CommandFilters { 
  //   return []
  // }


  contentCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
    // console.log(this.constructor.name, 'contentCommandFilters returning empty')
    return []//this.effectsCommandFilters(args)
  }

  copyCommandFilter(input: string, track: number, id = 'content'): CommandFilter {
    const output = `${id}-${track}`
    const commandFilter: CommandFilter = {
      inputs: [input], ffmpegFilter: 'copy', options: {}, outputs: [output]
    }
    return commandFilter
  }

  fileCommandFiles(cacheArgs: CacheArgs): CommandFiles {
    const commandFiles: CommandFiles = []
    const files = this.asset.assetGraphFiles(cacheArgs)
    // console.log(this.constructor.name, 'ServerInstanceClass.fileCommandFiles', cacheArgs, files.length)
    let inputCount = 0
    commandFiles.push(...files.map((graphFile, index) => {
      const { input } = graphFile
      const inputId = (index && input) ? `${this.id}-${inputCount}` : this.id
      const commandFile: CommandFile = { ...graphFile, inputId }
      if (input) inputCount++
      return commandFile
    }))
    return commandFiles
  }

  initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container = false): CommandFilters {
    return errorThrow(ERROR.Unimplemented)
  }

  intrinsicGraphFile(options: IntrinsicOptions): GraphFile {
    const { size: visible, duration: audible } = options
    const graphFileArgs: CacheArgs = { visible, audible }
    const [graphFile] = this.asset.assetGraphFiles(graphFileArgs)
    assertObject(graphFile, 'graphFile')

    return graphFile
  }

  opacityCommandFilters(args: CommandFilterArgs): CommandFilters {
    const { outputSize: outputSize, filterInput, clipTime, time, videoRate } = args
    assertTimeRange(clipTime)
    const duration = isTimeRange(time) ? time.lengthSeconds : 0

    const [opacity, opacityEnd] = this.tweenValues('opacity', time, clipTime)
    // console.log(this.constructor.name, 'opacityCommandFilters', opacity, opacityEnd)
    if (!(isBelowOne(opacity) || (isDefined(opacityEnd) && isBelowOne(opacityEnd)))) {
      return []
    }
    assertNumber(opacity)
    assertPopulatedString(filterInput, 'filterInput')

    const options: ValueRecord = {
      lum: 'lum(X,Y)', cb: 'cb(X,Y)', cr: 'cr(X,Y)', a: `alpha(X,Y)*${opacity}` 
    }
    if (duration) {
      if (isNumber(opacityEnd) && opacity != opacityEnd) {
        const position = tweenPosition(videoRate, duration, 'N')
        const toValue = opacityEnd - opacity
        options.a = `alpha(X,Y)*(${opacity}+(${toValue}*${position}))`
      }
    }
    const commandFilter: CommandFilter = {
      ffmpegFilter: 'geq', 
      inputs: [filterInput], 
      options, outputs: [idGenerate('opacity')]
    }
    return [commandFilter]
  }

  overlayCommandFilters(bottomInput: string, topInput: string, alpha?: boolean): CommandFilters {
    assertPopulatedString(bottomInput, 'bottomInput')
    assertPopulatedString(topInput, 'topInput')

    const overlayCommandFilter: CommandFilter = {
      ffmpegFilter: 'overlay',
      options: {
         alpha: 'straight', format: alpha ? 'yuv420p10' : 'yuv420'
      }, 
      inputs: [bottomInput, topInput],
      outputs: [idGenerate(topInput)],
    }
    return [overlayCommandFilter]
  }

  scaleCommandFilters(args: CommandFilterArgs): CommandFilters {
    const { time, containerRects, filterInput, videoRate } = args
    assertArray(containerRects, 'containerRects')
    assertPopulatedString(filterInput, 'filterInput')
    
    const [rect, rectEnd] = containerRects
    assertRect(rect)
    assertRect(rectEnd)

    const { width, height } = sizeEven(rect)
    const { width: widthEnd, height: heightEnd } = sizeEven(rectEnd)

    const duration = isTimeRange(time) ? time.lengthSeconds : 0
    // console.log(this.constructor.name, 'scaleCommandFilters', containerRects, duration)
    const ffmpegFilter = 'scale'
    const position = tweenPosition(videoRate, duration)
    const options: ValueRecord = {
      width: tweenOption(width, widthEnd, position, true),
      height: tweenOption(height, heightEnd, position, true),
      // sws_flags: 'accurate_rnd',
    }
    if (!(isNumber(options.width) && isNumber(options.height))) options.eval = 'frame'

    const commandFilter: CommandFilter = {
      inputs: [filterInput], ffmpegFilter, options, 
      outputs: [idGenerate(ffmpegFilter)]
    }
    return [commandFilter]
  }
  
  translateCommandFilters(args: CommandFilterArgs): CommandFilters {
    const {
      outputSize, time, containerRects, chainInput, filterInput, videoRate
    } = args
    if (!chainInput) return []

    assertPopulatedArray(containerRects)
    const [rect, rectEnd] = containerRects
    const duration = isTimeRange(time) ? time.lengthSeconds : 0

    assertPopulatedString(filterInput, 'filterInput')

    const position = tweenPosition(videoRate, duration, '(n-1)') // overlay bug

    const endX = duration ? rectEnd.x : 0.5
    const endY = duration ? rectEnd.y : 0.5
    const x = tweenOption(rect.x, endX, position, true)
    const y = tweenOption(rect.y, endY, position, true)

    const options: ValueRecord = {
      alpha: 'straight', format: 'yuv420'
    }

    if (x !== 0) options.x = x
    if (y !== 0) options.y = y
    
    const overlayCommandFilter: CommandFilter = {
      ffmpegFilter: 'overlay',
      options, 
      inputs: [chainInput, filterInput],
      outputs: [],
    }
    return [overlayCommandFilter]
  }

  visibleCommandFiles(_args: VisibleCommandFileArgs): CommandFiles {
    const graphFileArgs: CacheArgs = { visible: true }
    return this.fileCommandFiles(graphFileArgs)
  }
}

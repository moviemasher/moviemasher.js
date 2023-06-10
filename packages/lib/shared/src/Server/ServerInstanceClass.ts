import type { ValueRecord } from '@moviemasher/runtime-shared'
import { ServerAsset } from "./Asset/ServerAsset.js"
import { CommandFile, CommandFileArgs, CommandFiles, CommandFilter, CommandFilterArgs, CommandFilters, FilterCommandFilterArgs, GraphFile, GraphFiles, ServerPromiseArgs, VisibleCommandFileArgs, VisibleCommandFilterArgs } from './GraphFile.js'
import { PreloadArgs } from "../Base/CacheTypes.js"
import { PropertyTweenSuffix } from "../Base/PropertiedConstants.js"
import { colorBlackOpaque, colorWhite } from '../Helpers/Color/ColorConstants.js'
import { errorThrow } from '../Helpers/Error/ErrorFunctions.js'
import { ErrorName } from '../Helpers/Error/ErrorName.js'
import { timeFromArgs, timeRangeFromArgs } from '../Helpers/Time/TimeUtilities.js'
import { IntrinsicOptions } from '../Shared/Mash/Clip/Clip.js'
import { Filter } from '../Plugin/Filter/Filter.js'
import { filterFromId } from '../Plugin/Filter/FilterFactory.js'
import { arrayLast } from '../Utility/ArrayFunctions.js'
import { idGenerate } from '../Utility/IdFunctions.js'
import { assertAboveZero, assertArray, assertObject, assertPopulatedArray, assertPopulatedString, assertTimeRange, isBelowOne, isDefined, isTimeRange } from '../Shared/SharedGuards.js'
import { assertRect, rectsEqual } from "../Utility/RectFunctions.js"
import { assertSize, sizeEven, sizesEqual } from "../Utility/SizeFunctions.js"
import { ServerInstance } from "./ServerInstance.js"
import { commandFilesInput } from './Utility/CommandFilesFunctions.js'
import { Tweening, tweenMaxSize } from '../Helpers/TweenFunctions.js'
import { InstanceClass } from '../Shared/Instance/InstanceClass.js'
import { ServerEffect } from '../Effect/Effect.js'


export class ServerInstanceClass extends InstanceClass implements ServerInstance {

  private _alphamergeFilter?: Filter
  private get alphamergeFilter() { return this._alphamergeFilter ||= filterFromId('alphamerge') }

  alphamergeCommandFilters(args: CommandFilterArgs): CommandFilters {
    const commandFilters: CommandFilters = []
    const { videoRate, outputSize: rect, track, filterInput } = args
    assertPopulatedString(filterInput)
    assertAboveZero(videoRate)
    assertSize(rect)

    const chainInput = `content-${track}`
    const filterArgs: FilterCommandFilterArgs = {
      videoRate: 0, duration: 0, filterInput, chainInput
    }
    const { alphamergeFilter } = this
    commandFilters.push(...alphamergeFilter.commandFilters(filterArgs))
    return commandFilters
  }

  amixCommandFilters(args: CommandFilterArgs): CommandFilters {
    const { chainInput, filterInput } = args
    assertPopulatedString(chainInput)
    assertPopulatedString(filterInput)
    const amixFilter = 'amix'
    // const amixId = idGenerate(amixFilter)
    const commandFilters: CommandFilters = []
    const commandFilter: CommandFilter = {
      inputs: [chainInput, filterInput],
      ffmpegFilter: amixFilter,
      options: { normalize: 0 }, outputs: []
    }

    commandFilters.push(commandFilter)
    return commandFilters
  }

  declare asset: ServerAsset


  audibleCommandFiles(args: CommandFileArgs): CommandFiles {
    const graphFileArgs: PreloadArgs = {
      ...args, audible: true, visible: false
    }
    return this.fileCommandFiles(graphFileArgs)
  }

  audibleCommandFilters(args: CommandFilterArgs): CommandFilters {
    const commandFilters: CommandFilters = []
    const { time, quantize, commandFiles, clipTime } = args
    // console.log(this.constructor.name, 'initialCommandFilters', time, clipTime)
    const timeDuration = time.isRange ? time.lengthSeconds : 0
    const duration = timeDuration ? Math.min(timeDuration, clipTime!.lengthSeconds) : 0

    const { id } = this
    // console.log(this.constructor.name, 'audibleCommandFilters calling commandFilesInput', id)
    let filterInput = commandFilesInput(commandFiles, id, false)

    const trimFilter = 'atrim'
    const trimId = idGenerate(trimFilter)
    const trimOptions: ValueRecord = {}

    const { frame } = this.assetTime(time)

    if (duration)
      trimOptions.duration = duration
    if (frame)
      trimOptions.start = timeFromArgs(frame, quantize).seconds

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

  colorBackCommandFilters(args: VisibleCommandFilterArgs, output?: string): CommandFilters {
    const { contentColors = [], videoRate, outputSize, duration } = args
    assertSize(outputSize)
    const evenSize = sizeEven(outputSize)
    const [color = colorBlackOpaque, colorEnd = colorBlackOpaque] = contentColors
    const outputString = output || idGenerate('back')
    const { colorFilter } = this
    const colorArgs: FilterCommandFilterArgs = { videoRate, duration }
    colorFilter.setValue(color, 'color')
    colorFilter.setValue(colorEnd, `color${PropertyTweenSuffix}`)
    colorFilter.setValue(evenSize.width, 'width')
    colorFilter.setValue(evenSize.height, 'height')
    colorFilter.setValue(evenSize.width, `width${PropertyTweenSuffix}`)
    colorFilter.setValue(evenSize.height, `height${PropertyTweenSuffix}`)
    const commandFilters = colorFilter.commandFilters(colorArgs)

    if (sizesEqual(evenSize, outputSize)) {
      arrayLast(commandFilters).outputs = [outputString]
    } else {
      const filterInput = arrayLast(arrayLast(commandFilters).outputs)
      assertPopulatedString(filterInput, 'crop input')
      const cropFilter = 'crop'
      // const cropId = idGenerate(cropFilter)
      const cropCommandFilter: CommandFilter = {
        inputs: [filterInput], ffmpegFilter: cropFilter,
        options: { w: outputSize.width, h: outputSize.height, exact: 1 },
        outputs: [outputString]
      }
      commandFilters.push(cropCommandFilter)
    }
    return commandFilters
  }


  private _colorizeFilter?: Filter
  get colorizeFilter() { return this._colorizeFilter ||= filterFromId('colorize') }

  colorizeCommandFilters(args: CommandFilterArgs): CommandFilters {
    const { contentColors: colors, videoRate, filterInput, time } = args
    assertPopulatedArray(colors)
    const duration = isTimeRange(time) ? time.lengthSeconds : 0

    const { colorizeFilter } = this
    const filterArgs: FilterCommandFilterArgs = {
      videoRate, duration, filterInput
    }
    const [color, colorEnd] = colors
    colorizeFilter.setValue(color, 'color')
    colorizeFilter.setValue(colorEnd, `color${PropertyTweenSuffix}`)

    return colorizeFilter.commandFilters(filterArgs)
  }

  colorMaximize = false

  commandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container = false): CommandFilters {
    const commandFilters: CommandFilters = []
    const { filterInput: input = '' } = args
    let filterInput = input
    // console.log(this.constructor.name, 'commandFilters', container)
    const initialFilters = this.initialCommandFilters(args, tweening, container)
    if (initialFilters.length) {
      commandFilters.push(...initialFilters)
      filterInput = arrayLast(arrayLast(initialFilters).outputs)
    }
    if (container)
      commandFilters.push(...this.containerCommandFilters({ ...args, filterInput }, tweening))
    else
      commandFilters.push(...this.contentCommandFilters({ ...args, filterInput }, tweening))
    return commandFilters
  }

  containerColorCommandFilters(args: VisibleCommandFilterArgs): CommandFilters {
    const commandFilters: CommandFilters = []
    const { contentColors: colors = [], containerRects, videoRate, duration } = args
    assertArray(containerRects, 'containerRects')
    const [rect, rectEnd] = containerRects

    const colorArgs: FilterCommandFilterArgs = { videoRate, duration }

    const { colorFilter } = this
    const [color, colorEnd] = colors

    colorFilter.setValue(color || colorWhite, 'color')
    colorFilter.setValue(colorEnd || colorWhite, `color${PropertyTweenSuffix}`)
    colorFilter.setValue(rect.width, 'width')
    colorFilter.setValue(rect.height, 'height')

    colorFilter.setValue(rectEnd.width, `width${PropertyTweenSuffix}`)
    colorFilter.setValue(rectEnd.height, `height${PropertyTweenSuffix}`)
    commandFilters.push(...colorFilter.commandFilters(colorArgs))

    const { contentColors, track } = args

    const { colorMaximize } = this
    if (!colorMaximize)
      return commandFilters

    assertPopulatedArray(contentColors)

    const tweeningSize = !rectsEqual(...containerRects)
    const maxSize = tweeningSize ? tweenMaxSize(...containerRects) : containerRects[0]
    const filterArgs: VisibleCommandFilterArgs = {
      ...args, outputSize: maxSize
    }
    commandFilters.push(...this.colorBackCommandFilters(filterArgs, `content-${track}`))

    return commandFilters
  }

  containerCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
    const commandFilters: CommandFilters = []
    const { contentColors, filterInput: input } = args
    let filterInput = input
    // console.log(this.constructor.name, 'containerCommandFilters', filterInput)
    assertPopulatedString(filterInput, 'filterInput')

    if (!contentColors?.length) {
      commandFilters.push(...this.alphamergeCommandFilters({ ...args, filterInput }))
      filterInput = arrayLast(arrayLast(commandFilters).outputs)
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
    return this.effectsCommandFilters(args)
  }

  copyCommandFilter(input: string, track: number, id = 'content'): CommandFilter {
    const contentOutput = `${id}-${track}`
    const commandFilter: CommandFilter = {
      inputs: [input], ffmpegFilter: 'copy', options: {}, outputs: [contentOutput]
    }
    return commandFilter
  }

  declare effects: ServerEffect[]

  effectsCommandFiles(args: VisibleCommandFileArgs): CommandFiles {
    const { container } = this
    const files: CommandFiles = []
    if (!container) {
      files.push(...this.effects.flatMap(effect => effect.commandFiles(args)))
    }
    return files
  }

  private effectsCommandFilters(args: VisibleCommandFilterArgs): CommandFilters {
    const commandFilters: CommandFilters = []
    const { filterInput: input } = args
    let filterInput = input
    assertPopulatedString(filterInput)

    const { effects, isDefaultOrAudio } = this
    if (isDefaultOrAudio)
      return commandFilters

    commandFilters.push(...effects.flatMap(effect => {
      const filters = effect.commandFilters({ ...args, filterInput })
      if (filters.length)
        filterInput = arrayLast(arrayLast(filters).outputs)
      return filters
    }))
    return commandFilters
  }

  fileCommandFiles(graphFileArgs: PreloadArgs): CommandFiles {
    const commandFiles: CommandFiles = []
    const files = this.graphFiles(graphFileArgs)
    let inputCount = 0
    commandFiles.push(...files.map((graphFile, index) => {
      const { input } = graphFile
      const inputId = (index && input) ? `${this.id}-${inputCount}` : this.id
      const commandFile: CommandFile = { ...graphFile, inputId }
      if (input)
        inputCount++
      return commandFile
    }))
    return commandFiles
  }

  graphFiles(args: PreloadArgs): GraphFiles { return this.asset.graphFiles(args) }

  initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container = false): CommandFilters {
    return errorThrow(ErrorName.Unimplemented)
  }

  intrinsicGraphFile(options: IntrinsicOptions): GraphFile {
    const { size, duration } = options
    const clipTime = timeRangeFromArgs()
    const graphFileArgs: PreloadArgs = {
      time: clipTime.startTime, clipTime, quantize: clipTime.fps,
      visible: size, audible: duration,
    }
    const [graphFile] = this.graphFiles(graphFileArgs)
    assertObject(graphFile, 'graphFile')

    return graphFile
  }

  opacityCommandFilters(args: CommandFilterArgs): CommandFilters {
    const { outputSize: outputSize, filterInput, clipTime, time, videoRate } = args
    assertTimeRange(clipTime)
    const duration = isTimeRange(time) ? time.lengthSeconds : 0
    const commandFilters: CommandFilters = []
    const filterCommandFilterArgs: FilterCommandFilterArgs = {
      dimensions: outputSize, filterInput, videoRate, duration
    }
    const [opacity, opacityEnd] = this.tweenValues('opacity', time, clipTime)
    // console.log(this.constructor.name, 'opacityCommandFilters', opacity, opacityEnd)
    if (isBelowOne(opacity) || (isDefined(opacityEnd) && isBelowOne(opacityEnd))) {
      const { opacityFilter } = this
      opacityFilter.setValues({ opacity, opacityEnd })
      commandFilters.push(...opacityFilter.commandFilters(filterCommandFilterArgs))
    }

    return commandFilters
  }

  overlayCommandFilters(bottomInput: string, topInput: string, alpha?: boolean): CommandFilters {
    assertPopulatedString(bottomInput, 'bottomInput')
    assertPopulatedString(topInput, 'topInput')

    const commandFilters: CommandFilters = []
    const overlayArgs: FilterCommandFilterArgs = {
      filterInput: topInput, chainInput: bottomInput, videoRate: 0, duration: 0
    }
    const { overlayFilter } = this

    if (alpha)
      overlayFilter.setValue('yuv420p10', 'format')
    overlayFilter.setValue(0, 'x')
    overlayFilter.setValue(0, 'y')

    commandFilters.push(...overlayFilter.commandFilters(overlayArgs))
    const commandFilter = arrayLast(commandFilters)
    commandFilter.outputs = [idGenerate(topInput)]
    return commandFilters
  }

  scaleCommandFilters(args: CommandFilterArgs): CommandFilters {
    const { time, containerRects, filterInput: input, videoRate } = args
    const filterInput = input
    assertPopulatedString(filterInput, 'filterInput')

    assertArray(containerRects, 'containerRects')
    const [rect, rectEnd] = containerRects
    assertRect(rect)
    assertRect(rectEnd)

    const duration = isTimeRange(time) ? time.lengthSeconds : 0
    // console.log(this.constructor.name, 'scaleCommandFilters', containerRects, duration)
    const commandFilters: CommandFilters = []

    const { scaleFilter } = this
    const filterCommandFilterArgs: FilterCommandFilterArgs = {
      duration, videoRate, filterInput
    }
    scaleFilter.setValue(rect.width, 'width')
    scaleFilter.setValue(rect.height, 'height')
    scaleFilter.setValue(rectEnd.width, `width${PropertyTweenSuffix}`)
    scaleFilter.setValue(rectEnd.height, `height${PropertyTweenSuffix}`)
    commandFilters.push(...scaleFilter.commandFilters(filterCommandFilterArgs))
    return commandFilters
  }

  serverPromise(args: ServerPromiseArgs): Promise<void> {
    return this.asset.serverPromise(args)
  }
  
  translateCommandFilters(args: CommandFilterArgs): CommandFilters {
    const commandFilters: CommandFilters = []
    const {
      outputSize, time, containerRects, chainInput, filterInput, videoRate
    } = args
    if (!chainInput)
      return commandFilters

    assertPopulatedArray(containerRects)
    const [rect, rectEnd] = containerRects
    const duration = isTimeRange(time) ? time.lengthSeconds : 0
    const { overlayFilter } = this

    // overlayFilter.setValue('yuv420p10', 'format')
    overlayFilter.setValue(rect.x, 'x')
    overlayFilter.setValue(rect.y, 'y')
    if (duration) {
      overlayFilter.setValue(rectEnd.x, `x${PropertyTweenSuffix}`)
      overlayFilter.setValue(rectEnd.y, `y${PropertyTweenSuffix}`)
    }
    const filterArgs: FilterCommandFilterArgs = {
      dimensions: outputSize, filterInput, videoRate, duration, chainInput
    }
    commandFilters.push(...overlayFilter.commandFilters(filterArgs))
    return commandFilters
  }
  visibleCommandFiles(args: VisibleCommandFileArgs): CommandFiles {
    const graphFileArgs: PreloadArgs = {
      ...args, audible: false, visible: true
    }
    const files = this.fileCommandFiles(graphFileArgs)
    // console.log(this.constructor.name, 'visibleCommandFiles', files)
    files.push(...this.effectsCommandFiles(args))

    return files
  }
}

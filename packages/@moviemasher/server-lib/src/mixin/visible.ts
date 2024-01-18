import type { Constrained, Size, Value, ValueRecord, VisibleAsset, VisibleInstance } from '@moviemasher/shared-lib/types.js'
import type { ServerVisibleAsset } from '../type/ServerAssetTypes.js'
import type { CommandFiles, CommandFilter, CommandFilterArgs, CommandFilters, ServerAsset, ServerInstance, ServerVisibleInstance, VideoCommandFilterArgs, VisibleCommandFileArgs, VisibleCommandFilterArgs } from '../types.js'

import { CONTENT, idGenerate } from '@moviemasher/shared-lib/runtime.js'
import { VisibleContentInstance } from '@moviemasher/shared-lib/types.js'
import { assertAboveZero, assertPopulatedString } from '@moviemasher/shared-lib/utility/guards.js'
import { isServerVisibleInstance } from '../guard/assets.js'
import { Tweening } from '../type/ServerTypes.js'

export function ServerVisibleAssetMixin<T extends Constrained<ServerAsset & VisibleAsset>>(Base: T):
T & Constrained<ServerVisibleAsset> {
  return class extends Base implements ServerVisibleAsset {}
}

export function ServerVisibleInstanceMixin<T extends Constrained<ServerInstance & VisibleInstance>>(Base: T):
  T & Constrained<ServerVisibleInstance> {
  return class extends Base implements ServerVisibleInstance {
    private alphamergeCommandFilters(args: VideoCommandFilterArgs): CommandFilters {
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

    declare asset: ServerVisibleAsset

    canColor(_: CommandFilterArgs): boolean { return false }

    canColorTween(_: CommandFilterArgs): boolean { return false }

    colorBackCommandFilters(args: VideoCommandFilterArgs, output?: string, intrinsicSize?: Size): CommandFilters {
      const commandFilters: CommandFilters = []
// const outputString = output || idGenerate('back')
//       const { videoRate, outputSize, duration } = args
//       assertSize(outputSize)
//       const evenSize = sizeEven(outputSize)
//       const [color = RGBA_BLACK, colorEnd = RGBA_BLACK] = contentColors

//       // console.log(this.constructor.name, 'colorBackCommandFilters', {color, colorEnd})
      

//       if (sizesEqual(evenSize, outputSize)) {
//         commandFilters.push(...this.colorCommandFilters(duration, videoRate, evenSize, evenSize, color, colorEnd))
//         const lastFilter = arrayLast(commandFilters)
//         // console.log(this.constructor.name, 'colorBackCommandFilters', 'sizesEqual', evenSize, outputSize, 'SET', lastFilter.outputs, '=', outputString)
//         lastFilter.outputs = [outputString]
//       } else {
//         const doubleSize = { width: evenSize.width * 2, height: evenSize.height * 2 }
//         commandFilters.push(...this.colorCommandFilters(duration, videoRate, evenSize, evenSize, color, colorEnd))
//         const filterInput = arrayLast(arrayLast(commandFilters).outputs)
//         assertPopulatedString(filterInput, 'crop input')

//         const cropCommandFilter: CommandFilter = {
//           inputs: [filterInput], ffmpegFilter: 'crop',
//           options: { w: outputSize.width, h: outputSize.height },
//           outputs: [outputString]
//         }
//         commandFilters.push(cropCommandFilter)
//       }
      return commandFilters
    }

    colorCommandFilters(duration: number, videoRate: number, rect: Size, rectEnd: Size, color: Value, colorTween: Value): CommandFilters {
      const commandFilters: CommandFilters = []
      // assertAboveZero(videoRate, 'videoRate')
      // assertPopulatedString(color)

      // const colorEnd = duration ? colorTween : undefined
      // const tweeningColor = isPopulatedString(colorEnd) && color !== colorEnd

      // const { width, height } = rect

      // let tweeningSize = false
      // const startSize = { width, height }
      // const endSize = { width, height }

      // if (duration) {
      //   const {
      //     width: widthEnd = width, height: heightEnd = height,
      //   } = rectEnd
      //   assertNumber(widthEnd)
      //   assertNumber(heightEnd)
      //   tweeningSize = !(width === widthEnd && height === heightEnd)
      //   if (tweeningSize) {
      //     endSize.width = widthEnd
      //     endSize.height = heightEnd
      //   }
      // }
      // const maxSize = sizeEven(tweeningSize ? tweenMaxSize(startSize, endSize) : startSize)
      // const ffmpegFilter = 'color'
      // let filterInput = idGenerate(ffmpegFilter)
      // const commandFilter: CommandFilter = {
      //   inputs: [], ffmpegFilter,
      //   options: {
      //     color, rate: videoRate, size: sizeValueString(maxSize)
      //   },
      //   outputs: [filterInput]
      // }
      // if (isAboveZero(duration)) commandFilter.options.duration = duration
      // commandFilters.push(commandFilter)

      // // console.log(this.constructor.name, 'colorCommandFilters', {filterInput, tweeningColor, tweeningSize, duration})
      // if (tweeningColor) {
      //   const fadeFilter = 'fade'
      //   const fadeFilterId = idGenerate(fadeFilter)
      //   const fadeCommandFilter: CommandFilter = {
      //     inputs: [filterInput], ffmpegFilter: fadeFilter,
      //     options: {
      //       type: 'out',
      //       color: colorEnd, duration,
      //     },
      //     outputs: [fadeFilterId]
      //   }
      //   commandFilters.push(fadeCommandFilter)
      //   filterInput = fadeFilterId
      // }

      // if (tweeningSize) {
      //   const scaleFilter = 'scale'
      //   const scaleFilterId = idGenerate(scaleFilter)
      //   const position = tweenPosition(videoRate, duration)
      //   const scaleCommandFilter: CommandFilter = {
      //     inputs: [filterInput], ffmpegFilter: scaleFilter,
      //     options: {
      //       eval: FRAME,
      //       width: tweenOption(startSize.width, endSize.width, position),
      //       height: tweenOption(startSize.height, endSize.height, position),
      //     },
      //     outputs: [scaleFilterId]
      //   }
      //   commandFilters.push(scaleCommandFilter)
      // }
      return commandFilters
    }

    containerColorCommandFilters(args: VisibleCommandFilterArgs): CommandFilters {
      const commandFilters: CommandFilters = []
      // const { containerRects, videoRate, duration } = args
      // assertArray(containerRects, 'containerRects')

      // const [rect, rectEnd] = containerRects
      // const [color = RGB_WHITE, colorEnd = RGB_WHITE] = colors
      // commandFilters.push(
      //   ...this.colorCommandFilters(
      //     duration, videoRate, rect, rectEnd, color, colorEnd
      //   )
      // )
      return commandFilters
    }

    // was in base class but not called??
    // containerCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
    //   return this.instanceCommandFilters(args, tweening)
    // }
    containerCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
      const commandFilters: CommandFilters = []
      // const {
      //   commandFiles, containerRects, filterInput: input, track
      // } = args
      // let filterInput = input
      // const [containerRect, containerRectEnd] = containerRects
      // const maxSize = sizeEven(tweening.size ? tweenMaxSize(containerRect, containerRectEnd) : containerRect)

      // const { id } = this

      // const commandInput = commandFiles.find(commandFile => commandFile.input && commandFile.inputId === id)
      // assertDefined(commandInput, 'commandInput')
      // const { asset } = commandInput
      // if (!isServerVisibleAsset(asset)) {
      //   return commandFilters
      // }
      // const { probeSize } = asset

      // // add color box first
      // const colorArgs: VisibleCommandFilterArgs = {
      //   ...args, outputSize: maxSize, //contentColors: [RGBA_BLACK, RGBA_BLACK]
      // }
      // const colorInput = `container-${track}-back`
      // commandFilters.push(...this.colorBackCommandFilters(colorArgs, colorInput, probeSize))
      // const fileInput = [id, 'v'].join(COLON)

      // // then add file input, scaled
      // commandFilters.push(...this.scaleCommandFilters({ ...args, filterInput: fileInput }))
      // filterInput = arrayLast(arrayLast(commandFilters).outputs)

      // if (tweening.size) {
      //   // overlay scaled file input onto color box
      //   assertPopulatedString(filterInput, 'overlay input')
      //   commandFilters.push(...this.overlayCommandFilters(colorInput, filterInput))
      //   filterInput = arrayLast(arrayLast(commandFilters).outputs)
      // }
      // // crop file input
      // assertPopulatedString(filterInput, 'crop input')

      // const options: ValueRecord = { ...POINT_ZERO } //exact: 1,
      // const cropOutput = idGenerate('crop')
      // const { width, height } = maxSize
      // if (isTrueValue(width)) options.w = width
      // if (isTrueValue(height)) options.h = height
      // const commandFilter: CommandFilter = {
      //   ffmpegFilter: 'crop',
      //   inputs: [filterInput],
      //   options,
      //   outputs: [cropOutput]
      // }
      // commandFilters.push(commandFilter)
      // filterInput = cropOutput

      // if (!tweening.size) {
      //   // overlay scaled and cropped file input onto color box
      //   assertPopulatedString(filterInput, 'overlay input')
      //   commandFilters.push(...this.overlayCommandFilters(colorInput, filterInput))
      //   filterInput = arrayLast(arrayLast(commandFilters).outputs)
      // }

      // assertPopulatedString(filterInput, 'alphamerge input')
      // commandFilters.push(...this.alphamergeCommandFilters({ ...args, filterInput }))
      // filterInput = arrayLast(arrayLast(commandFilters).outputs)

      // // then we need to do opacity and merge
      // commandFilters.push(...this.containerFinalCommandFilters({ ...args, filterInput }))
      return commandFilters
    }


    containerFinalCommandFilters(args: VisibleCommandFilterArgs): CommandFilters {
      const commandFilters: CommandFilters = []
      const { filterInput } = args
      // let filterInput = input
      assertPopulatedString(filterInput)

      // const opacityFilters = this.opacityCommandFilters(args)
      // if (opacityFilters.length) {
      //   commandFilters.push(...opacityFilters)
      //   filterInput = arrayLast(arrayLast(opacityFilters).outputs)
      // }
      commandFilters.push(...this.translateCommandFilters({ ...args, filterInput }))
      return commandFilters
    }

    copyCommandFilter(input: string, track: number, id = CONTENT): CommandFilter {
      const output = `${id}-${track}`
      const commandFilter: CommandFilter = {
        inputs: [input], ffmpegFilter: 'copy', options: {}, outputs: [output]
      }
      return commandFilter
    }

    initialCommandFilters(args: VisibleCommandFilterArgs, _tweening: Tweening, container = false): CommandFilters {
      const commandFilters: CommandFilters = []
      if (container) {
        const { filterInput, track } = args
        assertPopulatedString(filterInput)

        commandFilters.push(this.copyCommandFilter(filterInput, track))
      }
      return commandFilters
    }

    // instanceCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
    //   const commandFilters: CommandFilters = []
    //   const { filterInput: input } = args
    //   let filterInput = input
    //   assertPopulatedString(filterInput)

    //   if (!tweening.canColor) {
    //     const mergeFilters = this.alphamergeCommandFilters({ ...args, filterInput })

    //     commandFilters.push(...mergeFilters)
    //     filterInput = arrayLast(arrayLast(commandFilters).outputs)
    //   }
    //   commandFilters.push(...this.containerFinalCommandFilters({ ...args, filterInput }))
    //   return commandFilters
    // }

    // private opacityCommandFilters(args: VisibleCommandFilterArgs): CommandFilters {
    //   const { filterInput, clipTime, time, videoRate } = args
    //   assertTimeRange(clipTime)
    //   const duration = isTimeRange(time) ? time.lengthSeconds : 0

    //   const [opacity, opacityEnd] = this.tweenValues('opacity', time, clipTime)
    //   if (!(isBelowOne(opacity) || (isDefined(opacityEnd) && isBelowOne(opacityEnd)))) {
    //     return []
    //   }
    //   assertNumber(opacity)
    //   assertPopulatedString(filterInput, 'filterInput')

    //   const options: ValueRecord = {
    //     lum: 'lum(X,Y)', cb: 'cb(X,Y)', cr: 'cr(X,Y)', a: `alpha(X,Y)*${opacity}`
    //   }
    //   if (duration) {
    //     if (isNumber(opacityEnd) && opacity != opacityEnd) {
    //       const position = tweenPosition(videoRate, duration, 'N')
    //       const toValue = opacityEnd - opacity
    //       options.a = `alpha(X,Y)*(${opacity}+(${toValue}*${position}))`
    //     }
    //   }
    //   const commandFilter: CommandFilter = {
    //     ffmpegFilter: 'geq',
    //     inputs: [filterInput],
    //     options, outputs: [idGenerate('opacity')]
    //   }
    //   return [commandFilter]
    // }

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

    scaleCommandFilters(args: VisibleCommandFilterArgs): CommandFilters {
      return []
      // const { time, containerRects, filterInput, videoRate } = args
      // assertArray(containerRects, 'containerRects')
      // assertPopulatedString(filterInput, 'filterInput')

      // const [rect, rectEnd] = containerRects
      // assertRect(rect)
      // assertRect(rectEnd)

      // const { width, height } = sizeEven(rect)
      // const { width: widthEnd, height: heightEnd } = sizeEven(rectEnd)
      // const duration = isTimeRange(time) ? time.lengthSeconds : 0
      // const ffmpegFilter = 'scale'
      // const position = tweenPosition(videoRate, duration)
      // const options: ValueRecord = {
      //   width: tweenOption(width, widthEnd, position, true),
      //   height: tweenOption(height, heightEnd, position, true),
      //   // sws_flags: 'accurate_rnd',
      // }
      // if (!(isNumber(options.width) && isNumber(options.height))) options.eval = FRAME

      // const commandFilter: CommandFilter = {
      //   inputs: [filterInput], ffmpegFilter, options,
      //   outputs: [idGenerate(ffmpegFilter)]
      // }
      // return [commandFilter]
    }

    // svgItem(_rect: Rect, _time: Time): DataOrError<SvgItem> {
    //   return namedError(ERROR.Evaluation, this.constructor.name)
    //   // const { clip } = this
    //   // const { timeRange: range } = clip
    //   // const orError = this.svgItemForTimelinePromise(rect, time)
    //   // if (isDefiniteError(orError)) return orError

    //   // const { data: svgItem } = orError
    //   // const svgFilter = this.containerSvgFilter(svgItem, rect, rect, time, range)
    //   // if (svgFilter) svgItem.setAttribute('filter', `url(#${svgFilter.id})`)
    //   // else svgItem.removeAttribute('filter')
    //   // return orError
    // }

    private translateCommandFilters(args: VisibleCommandFilterArgs): CommandFilters {
      const { chainInput, filterInput } = args
      if (!chainInput) return []

      // const [rect, rectEnd] = containerRects
      // const duration = isTimeRange(time) ? time.lengthSeconds : 0
      assertPopulatedString(filterInput, 'filterInput')

      // const position = tweenPosition(videoRate, duration, '(n-1)') // overlay bug

      // const endX = duration ? rectEnd.x : 0.5
      // const endY = duration ? rectEnd.y : 0.5
      // const x = tweenOption(rect.x, endX, position, true)
      // const y = tweenOption(rect.y, endY, position, true)

      const options: ValueRecord = { alpha: 'straight', format: 'yuv420' }
      // if (x !== 0) options.x = x
      // if (y !== 0) options.y = y

      const overlayCommandFilter: CommandFilter = {
        ffmpegFilter: 'overlay',
        options,
        inputs: [chainInput, filterInput],
        outputs: [],
      }
      return [overlayCommandFilter]
    }

    visibleCommandFiles(args: VisibleCommandFileArgs, content?: VisibleContentInstance): CommandFiles {
      const commandFiles = this.fileCommandFiles({ ...args, audible: false, visible: true })
      if (isServerVisibleInstance(content)) commandFiles.push(...content.visibleCommandFiles(args))
      return commandFiles

    }
  }
}

import type { CommandFilter, CommandFilterArgs, CommandFilters, VisibleCommandFilterArgs } from '../CommandFile.js'
import type { ContentRectArgs, ValueRecord } from "@moviemasher/runtime-shared"
import { Tweening, tweenOption, tweenPosition } from '../../Helpers/TweenFunctions.js'
import { arrayLast } from '../../Utility/ArrayFunctions.js'
import { assertPopulatedArray, assertPopulatedString, isTrueValue } from '../../Shared/SharedGuards.js'
import { assertTimeRange, isTimeRange } from "../../Shared/TimeGuards.js"
import { colorBlackOpaque, colorTransparent } from '../../Helpers/Color/ColorConstants.js'
import { commandFilesInput } from '../Utility/CommandFilesFunctions.js'
import { rectsEqual } from "../../Utility/RectFunctions.js"
import { tweenMaxSize } from '../../Helpers/TweenFunctions.js'
import { ServerInstance, ServerVisibleInstance } from '../ServerInstance.js'
import { Constrained } from '@moviemasher/runtime-shared'
import { VisibleInstance } from '@moviemasher/runtime-shared'
import { ServerVisibleAsset } from '../Asset/ServerAssetTypes.js'
import { idGenerate } from '../../Utility/IdFunctions.js'
import { PointZero } from '../../Utility/PointConstants.js'


export function ServerVisibleInstanceMixin<T extends Constrained<ServerInstance & VisibleInstance>>(Base: T):
  T & Constrained<ServerVisibleInstance> {

  return class extends Base implements ServerVisibleInstance {
    declare asset: ServerVisibleAsset

    initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container = false): CommandFilters {
      const commandFilters: CommandFilters = []
     
      if (container) {
        const { filterInput, track } = args

        // relabel input as content
        assertPopulatedString(filterInput)
        commandFilters.push(this.copyCommandFilter(filterInput, track))
      }
      return commandFilters
    }

    containerCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
      // console.log(this.constructor.name, 'containerCommandFilters')
      const commandFilters: CommandFilters = []
      const {
        commandFiles, containerRects, filterInput: input, videoRate, track
      } = args
      let filterInput = input

      const maxSize = tweening.size ? tweenMaxSize(...containerRects) : containerRects[0]

      // add color box first
      const colorArgs: VisibleCommandFilterArgs = {
        ...args,
        contentColors: [colorBlackOpaque, colorBlackOpaque],
        outputSize: maxSize, //{ width: maxSize.width * 2, height: maxSize.height * 2 }
      }
      commandFilters.push(...this.colorBackCommandFilters(colorArgs, `container-${track}-back`))
      const colorInput = arrayLast(arrayLast(commandFilters).outputs)

      const { id } = this
      // console.log(this.constructor.name, 'containerCommandFilters calling commandFilesInput', id)
      const fileInput = commandFilesInput(commandFiles, id, true)

      // then add file input, scaled
      commandFilters.push(...this.scaleCommandFilters({ ...args, filterInput: fileInput }))
      filterInput = arrayLast(arrayLast(commandFilters).outputs)

      if (tweening.size) {
        // overlay scaled file input onto color box
        assertPopulatedString(filterInput, 'overlay input')
        commandFilters.push(...this.overlayCommandFilters(colorInput, filterInput))
        filterInput = arrayLast(arrayLast(commandFilters).outputs)
      }
      // crop file input
      assertPopulatedString(filterInput, 'crop input')

      const options: ValueRecord = { exact: 1, ...PointZero }
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
      filterInput = cropOutput

      if (!tweening.size) {
        // overlay scaled and cropped file input onto color box
        assertPopulatedString(filterInput, 'overlay input')
        commandFilters.push(...this.overlayCommandFilters(colorInput, filterInput))
        filterInput = arrayLast(arrayLast(commandFilters).outputs)

      }

      assertPopulatedString(filterInput, 'alphamerge input')
      commandFilters.push(...this.alphamergeCommandFilters({ ...args, filterInput }))
      filterInput = arrayLast(arrayLast(commandFilters).outputs)

      // then we need to do effects, opacity, etc, and merge
      commandFilters.push(...this.containerFinalCommandFilters({ ...args, filterInput }))
      return commandFilters
    }

    contentCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
      const commandFilters: CommandFilters = []
      const {
        containerRects, visible, time, videoRate, clipTime, commandFiles, 
        filterInput: input, track
      } = args
      if (!visible)
        return commandFilters

      assertTimeRange(clipTime)
      assertPopulatedArray(containerRects, 'containerRects')

      const { id } = this
      let filterInput = input || commandFilesInput(commandFiles, id, visible)

      const contentArgs: ContentRectArgs = {
        containerRects: containerRects, time, timeRange: clipTime
      }
      const contentRects = this.contentRects(contentArgs)

      const tweeningContainer = !rectsEqual(...containerRects)

      const [contentRect, contentRectEnd] = contentRects
      const duration = isTimeRange(time) ? time.lengthSeconds : 0
      const maxContainerSize = tweeningContainer ? tweenMaxSize(...containerRects) : containerRects[0]

      const colorInput = `content-${track}-back`

      const colorArgs: VisibleCommandFilterArgs = {
        ...args, contentColors: [colorTransparent, colorTransparent],
        outputSize: maxContainerSize
      }
      commandFilters.push(...this.colorBackCommandFilters(colorArgs, colorInput))

      const scaleArgs: CommandFilterArgs = {
        ...args, filterInput, containerRects: contentRects
      }
      commandFilters.push(...this.scaleCommandFilters(scaleArgs))

      filterInput = arrayLast(arrayLast(commandFilters).outputs)

      if (tweening.size) {
        commandFilters.push(...this.overlayCommandFilters(colorInput, filterInput))
        filterInput = arrayLast(arrayLast(commandFilters).outputs)
      }
      const cropOutput = idGenerate('crop')
      const options: ValueRecord = { exact: 1 }
      const position = tweenPosition(videoRate, duration)
      options.x = tweenOption(contentRect.x, contentRectEnd.x, position, true)
      options.y = tweenOption(contentRect.y, contentRectEnd.y, position, true)
  
      const { width, height } = maxContainerSize
      if (isTrueValue(width)) options.w = width
      if (isTrueValue(height)) options.h = height
  
      const commandFilter: CommandFilter = {
        ffmpegFilter: 'crop', 
        inputs: [filterInput], 
        options, 
        outputs: [cropOutput]
      }

      commandFilters.push(commandFilter)
      filterInput = cropOutput

      const setsarOutput = idGenerate('setsar')
      const setsarCommandFilter: CommandFilter = {
        ffmpegFilter: 'setsar',
        options: { sar: '1/1', max: 100 },
        inputs: [filterInput],
        outputs: [setsarOutput]
      }
      commandFilters.push(setsarCommandFilter)
      filterInput = setsarOutput

      if (!tweening.size) {
        commandFilters.push(...this.overlayCommandFilters(colorInput, filterInput, this.asset.alpha))
        filterInput = arrayLast(arrayLast(commandFilters).outputs)
      }

      commandFilters.push(...super.contentCommandFilters({ ...args, filterInput }, tweening))
      return commandFilters
    }
  }
}

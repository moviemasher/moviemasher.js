import type { CommandFilter, CommandFilterArgs, CommandFilters, VisibleCommandFilterArgs } from '@moviemasher/runtime-server'
import type { Constrained, ContentRectArgs, ValueRecord, VisibleInstance } from '@moviemasher/runtime-shared'
import type { ServerVisibleAsset } from '../Types/ServerAssetTypes.js'
import type { ServerInstance, ServerVisibleInstance } from '../Types/ServerInstanceTypes.js'
import type { Tweening } from '../Types/ServerTypes.js'

import { arrayLast, assertDefined, assertPopulatedArray, assertPopulatedString, assertTimeRange, colorBlackOpaque, colorTransparent, idGenerate, isTimeRange, isTrueValue, sizeEven } from '@moviemasher/lib-shared'
import { POINT_ZERO } from '@moviemasher/runtime-shared'
import { tweenMaxSize, tweenOption, tweenPosition } from '../Utility/Command.js'
import { commandFilesInput } from '../Utility/CommandFilesFunctions.js'
import { isServerVisibleAsset } from '../guard/assets.js'


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
        // console.log(this.constructor.name, 'initialCommandFilters calling copyCommandFilter', filterInput)
        commandFilters.push(this.copyCommandFilter(filterInput, track))
      }
      return commandFilters
    }

    containerCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
      // console.log(this.constructor.name, 'ServerVisibleInstanceMixin.containerCommandFilters')
      const commandFilters: CommandFilters = []
      const {
        commandFiles, containerRects, filterInput: input, videoRate, track
      } = args
      let filterInput = input
      const [containerRect, containerRectEnd] = containerRects
      const maxSize = sizeEven(tweening.size ? tweenMaxSize(containerRect, containerRectEnd) : containerRect)

      const { id } = this

      const commandInput = commandFiles.find(commandFile => commandFile.input && commandFile.inputId === id)
      assertDefined(commandInput, 'commandInput')
      const { definition } = commandInput
      if (!isServerVisibleAsset(definition)) {
        return commandFilters
      }
      const { sourceSize } = definition
        
      // add color box first
      const colorArgs: VisibleCommandFilterArgs = {
        ...args,
        contentColors: [colorBlackOpaque, colorBlackOpaque],
        outputSize: maxSize,
      }//, //
      const colorInput = `container-${track}-back`
      // console.log(this.constructor.name, 'ServerVisibleInstanceMixin.containerCommandFilters calling colorBackCommandFilters', colorInput)
      commandFilters.push(...this.colorBackCommandFilters(colorArgs, colorInput, sourceSize))
      // const colorInput = arrayLast(arrayLast(commandFilters).outputs)

    
      // console.log(this.constructor.name, 'containerCommandFilters calling commandFilesInput', commandFiles.length)
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

      const options: ValueRecord = {  ...POINT_ZERO }//exact: 1,
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

      // then we need to do opacity and merge
      commandFilters.push(...this.containerFinalCommandFilters({ ...args, filterInput }))
      return commandFilters
    }

    contentCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
      const commandFilters: CommandFilters = []
      const {
        containerRects, visible, time, videoRate, clipTime, commandFiles, 
        filterInput: input, track, outputSize
      } = args
      if (!visible)
        return commandFilters

      assertTimeRange(clipTime)
      assertPopulatedArray(containerRects, 'containerRects')

      const { id } = this
      let filterInput = input || commandFilesInput(commandFiles, id, visible)

      const shortest = outputSize.width < outputSize.height ? 'width' : 'height'
      const contentArgs: ContentRectArgs = {
        containerRects, time, timeRange: clipTime, shortest,
      }
      const contentRects = this.contentRects(contentArgs)
      const [contentRect, contentRectEnd] = contentRects
      const duration = isTimeRange(time) ? time.lengthSeconds : 0
      const maxContainerSize = sizeEven(tweenMaxSize(...containerRects))

      const colorArgs: VisibleCommandFilterArgs = {
        ...args, contentColors: [colorTransparent, colorTransparent],
        outputSize: maxContainerSize
      }
      // console.log(this.constructor.name, 'ServerVisibleInstanceMixin.contentCommandFilters calling colorBackCommandFilters',colorInput)
      
      const contentBackInput = `content-${track}-back`
      commandFilters.push(...this.colorBackCommandFilters(colorArgs, contentBackInput))

      const scaleArgs: CommandFilterArgs = {
        ...args, filterInput, containerRects: contentRects
      }
      commandFilters.push(...this.scaleCommandFilters(scaleArgs))

      filterInput = arrayLast(arrayLast(commandFilters).outputs)

      if (tweening.size) {
        commandFilters.push(...this.overlayCommandFilters(contentBackInput, filterInput))
        filterInput = arrayLast(arrayLast(commandFilters).outputs)
      }
      const cropOutput = idGenerate('crop')
      const options: ValueRecord = {} // exact: 1 
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
        commandFilters.push(...this.overlayCommandFilters(contentBackInput, filterInput, this.asset.alpha))
        filterInput = arrayLast(arrayLast(commandFilters).outputs)
      }

      commandFilters.push(...super.contentCommandFilters({ ...args, filterInput }, tweening))
      return commandFilters
    }

  }
}

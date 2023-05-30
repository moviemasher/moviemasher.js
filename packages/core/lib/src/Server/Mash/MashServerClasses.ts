import { CommandFileArgs, CommandFiles, CommandFilterArgs, CommandFilters, GraphFiles, PreloadArgs, ServerPromiseArgs, VisibleCommandFileArgs, VisibleCommandFilterArgs } from '../../Base/Code.js';
import { MashAssetClass } from '../../Shared/Mash/MashClasses.js';
import { MashServerAsset, ServerClip } from './MashServerTypes.js';
import { Time, Times } from '@moviemasher/runtime-shared';
import { AVType } from '../../Setup/AVType.js';
import { AVTypeAudio } from '../../Setup/AVTypeConstants.js';
import { timeRangeFromArgs } from '../../Helpers/Time/TimeUtilities.js';
import { arrayLast } from '../../Utility/ArrayFunctions.js';
import { assertTrue, isPopulatedArray } from '../../Shared/SharedGuards.js';
import { assertSizeAboveZero, sizesEqual } from '../../Utility/SizeFunctions.js';
import { assertContainerInstance } from '../../Helpers/Container/ContainerFunctions.js';
import { ContainerRectArgs } from '../../Helpers/Container/Container.js';
import { IntrinsicOptions } from '../../Shared/Mash/Clip/Clip.js';
import { ServerInstance, ServerVisibleInstance } from '../ServerInstance.js';
import { ClipClass } from '../../Shared/Mash/Clip/ClipClass.js';
import { EmptyFunction } from '../../Setup/EmptyFunction.js';
import { Tweening } from '../../Helpers/TweenFunctions.js';
import { pointsEqual } from '../../Utility/PointFunctions.js';
import { isColorServerInstance } from '../Color/ColorServerTypes.js';


export class MashServerAssetClass extends MashAssetClass implements MashServerAsset {
  graphFiles(args: PreloadArgs): GraphFiles {
    throw new Error('Method not implemented.');
  }
  serverPromise(args: ServerPromiseArgs): Promise<void> {
    throw new Error('Method not implemented.');
  }
  timeRanges(avType: AVType, time: Time): Times {
    // const { time: startTime, graphType, avType } = args
    const { quantize } = this

    const start = time.scale(this.quantize, 'floor')
    const end = start.isRange ? start.timeRange.endTime : undefined

    const fullRangeClips = this.clipsInTimeOfType(time, avType)
    const { length } = fullRangeClips
    if (!length) return []

    if (length === 1 || !start.isRange || avType === AVTypeAudio ) return [time]

    const frames = new Set<number>()
    fullRangeClips.forEach(clip => {
      frames.add(Math.max(clip.frame, start.frame))
      frames.add(Math.min(clip.frame + clip.frames, end!.frame))
    })
    const uniqueFrames = [...frames].sort((a, b) => a - b)
    let frame = uniqueFrames.shift()!
    const ranges = uniqueFrames.map(uniqueFrame => {
      const range = timeRangeFromArgs(frame, quantize, uniqueFrame - frame)
      frame = uniqueFrame
      return range
    })
    return ranges
  }

}

export class ServerClipClass extends ClipClass implements ServerClip {
  clipCommandFiles(args: CommandFileArgs): CommandFiles {
    const commandFiles: CommandFiles = []
    const { visible, quantize, outputSize: outputSize, time } = args
    const clipTime = this.timeRange
    const { content, container } = this
    const contentArgs: CommandFileArgs = { ...args, clipTime }
    // console.log(this.constructor.name, 'commandFiles', visible, outputSize)

    
    if (visible) {
      assertSizeAboveZero(outputSize, 'outputSize')
      assertContainerInstance(container)
      const containerRectArgs: ContainerRectArgs = {
        size: outputSize, time, timeRange: clipTime, loading: true
      }

      // console.log(this.constructor.name, 'clipCommandFiles', containerRects)

      const containerRects = this.rects(containerRectArgs)

      const colors = isColorServerInstance(content) ? content.contentColors(time, clipTime) : undefined
      
      const fileArgs: VisibleCommandFileArgs = { 
        ...contentArgs, outputSize, contentColors: colors, containerRects 
      }
      if (!colors) {
        const contentFiles = content.visibleCommandFiles(fileArgs)
        // console.log(this.constructor.name, 'commandFiles content:', contentFiles.length)
        commandFiles.push(...contentFiles)
      }
      const containerFiles = container.visibleCommandFiles(fileArgs)

      // console.log(this.constructor.name, 'commandFiles container:', containerFiles.length)
      commandFiles.push(...containerFiles)
    } else {
      assertTrue(!visible, 'outputSize && container')
      commandFiles.push(...this.content.audibleCommandFiles(contentArgs)) 
    }
    return commandFiles
  }

  override get content(): ServerInstance { return super.content as ServerInstance }

  override get container(): ServerVisibleInstance { return super.container as ServerVisibleInstance}

  commandFilters(args: CommandFilterArgs): CommandFilters {
    const commandFilters:CommandFilters = []
    const { visible, quantize, outputSize, time } = args
    const clipTime = this.timeRange
    const contentArgs: CommandFilterArgs = { ...args, clipTime }
    const { content, container } = this
    if (!visible) return this.content.audibleCommandFilters(contentArgs)
      
    assertSizeAboveZero(outputSize, 'outputSize')
    assertContainerInstance(container)
    
    const containerRectArgs: ContainerRectArgs = {
      size: outputSize, time, timeRange: clipTime
    }
    const containerRects = this.rects(containerRectArgs)
    contentArgs.containerRects = containerRects
    const tweening: Tweening = { 
      point: !pointsEqual(...containerRects),
      size: !sizesEqual(...containerRects),
    }

    // console.log(this.constructor.name, 'commandFilters', contentArgs.containerRects)
    const isColor = isColorServerInstance(content)
    const colors = isColor ? content.contentColors(time, clipTime) : undefined


    // console.log(this.constructor.name, 'commandFilters', isColor, colors)

    const hasColorContent = isPopulatedArray(colors)
    if (hasColorContent) {
      tweening.color = colors[0] !== colors[1]
      tweening.canColor = tweening.color ? container.canColorTween(args) : container.canColor(args)
    }

    const timeDuration = time.isRange ? time.lengthSeconds : 0
    const duration = timeDuration ? Math.min(timeDuration, clipTime.lengthSeconds) : 0
    
    const containerArgs: VisibleCommandFilterArgs = { 
      ...contentArgs, contentColors: colors, outputSize, containerRects, duration
    }
    if (hasColorContent) {
      if (!tweening.canColor) {
        // inject color filter, I will alphamerge to colorize myself later
        commandFilters.push(...container.containerColorCommandFilters(containerArgs))
        containerArgs.filterInput = arrayLast(arrayLast(commandFilters).outputs)
      }
    } else {
      commandFilters.push(...content.commandFilters(containerArgs, tweening))
      containerArgs.filterInput = arrayLast(arrayLast(commandFilters).outputs)
    }

    commandFilters.push(...container.commandFilters(containerArgs, tweening, true))
     
    return commandFilters
  }

  intrinsicGraphFiles(options: IntrinsicOptions): GraphFiles {
    const { content, container } = this
    const files: GraphFiles = []
    if (!content.intrinsicsKnown(options)) {
      files.push(content.intrinsicGraphFile(options))
    }
    if (container && !container.intrinsicsKnown(options)) {
      files.push(container.intrinsicGraphFile(options))
    }
    return files
  }

  serverPromise(args: ServerPromiseArgs): Promise<void> {
    const { content, container } = this
    const promises = [content.serverPromise(args)]
    if (container) promises.push(container.serverPromise(args))
    return Promise.all(promises).then(EmptyFunction)  
  }
}
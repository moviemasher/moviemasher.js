import { CommandFileArgs, CommandFiles, CommandFilterArgs, CommandFilters, VisibleCommandFileArgs, VisibleCommandFilterArgs } from '../CommandFile.js'
import { GraphFiles, ServerPromiseArgs } from "@moviemasher/runtime-server"
import { PreloadArgs, Strings } from "@moviemasher/runtime-shared"
import { MashAssetClass } from '../../Shared/Mash/MashAssetClass.js'
import { ServerMashAsset, ServerClip, ServerClips, ServerTrack } from './ServerMashTypes.js'
import { Time, TimeRange, Times } from '@moviemasher/runtime-shared'
import { AVType } from '@moviemasher/runtime-shared'
import { AVTypeAudio } from '../../Setup/AVTypeConstants.js'
import { timeRangeFromArgs } from '../../Helpers/Time/TimeUtilities.js'
import { arrayLast } from '../../Utility/ArrayFunctions.js'
import { assertPopulatedString, assertTrue, isPopulatedArray } from '../../Shared/SharedGuards.js'
import { isPopulatedString } from "@moviemasher/runtime-shared"
import { assertSizeAboveZero, sizesEqual } from '../../Utility/SizeFunctions.js'
import { assertContainerInstance } from '../../Helpers/Container/ContainerGuards.js'
import { ContainerRectArgs } from '@moviemasher/runtime-shared'
import { IntrinsicOptions } from '@moviemasher/runtime-shared'
import { ServerInstance, ServerVisibleInstance } from '../ServerInstance.js'
import { ClipClass } from '../../Shared/Mash/Clip/ClipClass.js'
import { EmptyFunction } from '../../Setup/EmptyFunction.js'
import { Tweening } from '../../Shared/Utility/Tween/Tweening.js'
import { pointsEqual } from '../../Utility/PointFunctions.js'
import { TrackClass } from '../../Shared/Mash/Track/TrackClass.js'
import { TrackArgs } from '@moviemasher/runtime-shared'
import { ClipObject } from '@moviemasher/runtime-shared'
import { isColorInstance } from '../../Shared/Color/ColorGuards.js'
import { Instance } from '@moviemasher/runtime-shared'


const contentColors = (instance: Instance, time: Time, range: TimeRange): Strings | undefined => {
  if (!isColorInstance(instance)) return 
  
  const [color, colorEndOrNot] = instance.tweenValues('color', time, range)
  assertPopulatedString(color)
  const colors: Strings = [color]
  if (isPopulatedString(colorEndOrNot)) colors.push(colorEndOrNot)
  return colors
}

export class ServerMashAssetClass extends MashAssetClass implements ServerMashAsset {
  override get clips(): ServerClips { return super.clips as ServerClips }

  clipsInTimeOfType(time: Time, avType?: AVType): ServerClips {
    return super.clipsInTimeOfType(time, avType) as ServerClips
  }

  clipInstance(object: ClipObject): ServerClip {
    return new ServerClipClass(object)
  } 

  graphFiles(args: PreloadArgs): GraphFiles {
    throw new Error('Method not implemented.')
  }

  serverPromise(args: ServerPromiseArgs): Promise<void> {
    throw new Error('Method not implemented.')
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

  override trackInstance(args: TrackArgs): ServerTrack {
    return new ServerTrackClass(args)
  }
}

export class ServerClipClass extends ClipClass implements ServerClip {
  clipCommandFiles(args: CommandFileArgs): CommandFiles {
    const commandFiles: CommandFiles = []
    const { visible, outputSize, time } = args
    const clipTime = this.timeRange
    const { content, container } = this
    const contentArgs: CommandFileArgs = { ...args, clipTime }
    
    if (visible) {
      assertSizeAboveZero(outputSize, 'outputSize')
      assertContainerInstance(container)
      const containerRectArgs: ContainerRectArgs = {
        size: outputSize, time, timeRange: clipTime, loading: true
      }

      // console.log(this.constructor.name, 'clipCommandFiles', containerRects)

      const containerRects = this.rects(containerRectArgs)

      const colors = contentColors(content, time, clipTime) 
      
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
    const { visible, outputSize, time } = args
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
    const tweening: Tweening = { point: false, size: false }
    if (containerRects.length > 1) {
      tweening.point = !pointsEqual(containerRects[0], containerRects[1])
      tweening.size = !sizesEqual(containerRects[0], containerRects[1])
    }

    const colors = contentColors(content, time, clipTime) 

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

export class ServerTrackClass extends TrackClass implements ServerTrack {
  declare clips: ServerClips
  declare mash: ServerMashAsset
}
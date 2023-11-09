import type { CommandFile, CommandFileArgs, CommandFiles, CommandFilterArgs, CommandFilters, GraphFiles, ServerPromiseArgs, VisibleCommandFileArgs, VisibleCommandFilterArgs } from '@moviemasher/runtime-server'
import type { AVType, Asset, AssetObject, CacheArgs, ClipObject, ContainerRectArgs, DataOrError, Instance, IntrinsicOptions, Strings, Time, TimeRange, Times, TrackArgs } from '@moviemasher/runtime-shared'
import type { ServerInstance, ServerVisibleInstance } from '../../Types/ServerInstanceTypes.js'
import type { ServerClip, ServerClips, ServerMashAsset, ServerTrack } from '../../Types/ServerMashTypes.js'
import type { Tweening } from '../../Types/ServerTypes.js'

import { AVTypeAudio, ClipClass, MashAssetMixin, TrackClass, arrayLast, assertContainerInstance, assertPopulatedString, assertSizeAboveZero, assertTrue, isColorInstance, isPopulatedArray, pointsEqual, sizesEqual, timeRangeFromArgs } from '@moviemasher/lib-shared'
import { EventServerManagedAsset } from '@moviemasher/runtime-server'
import { isPopulatedString } from '@moviemasher/runtime-shared'
import { ServerAssetClass } from '../../Base/ServerAssetClass.js'

const contentColors = (instance: Instance, time: Time, range: TimeRange): Strings | undefined => {
  if (!isColorInstance(instance)) return 
  
  const [color, colorEndOrNot] = instance.tweenValues('color', time, range)
  assertPopulatedString(color)
  const colors: Strings = [color]
  if (isPopulatedString(colorEndOrNot)) colors.push(colorEndOrNot)
  return colors
}

const WithMashAsset = MashAssetMixin(ServerAssetClass)
export class ServerMashAssetClass extends WithMashAsset implements ServerMashAsset {
  override get clips(): ServerClips { return super.clips as ServerClips }

  clipsInTimeOfType(time: Time, avType?: AVType): ServerClips {
    return super.clipsInTimeOfType(time, avType) as ServerClips
  }

  clipInstance(object: ClipObject): ServerClip {
    return new ServerClipClass(object)
  } 

  assetGraphFiles(args: CacheArgs): GraphFiles {
    throw new Error('Method not implemented.')
  }

  serverPromise(_args: ServerPromiseArgs, _commandFile: CommandFile): Promise<DataOrError<number>> {
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
  override asset(assetIdOrObject: string | AssetObject): Asset {
    return EventServerManagedAsset.asset(assetIdOrObject)
  }

  clipCommandFiles(args: CommandFileArgs): CommandFiles {
    // console.log(this.constructor.name, 'clipCommandFiles', args)
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

      const containerRects = this.containerRects(containerRectArgs)

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
      commandFiles.push(...containerFiles)
    } else {
      assertTrue(!visible, 'outputSize && container')
      commandFiles.push(...this.content.audibleCommandFiles(contentArgs)) 
    }
    return commandFiles
  }

  override get content(): ServerInstance { return super.content as ServerInstance }

  override get container(): ServerVisibleInstance { return super.container as ServerVisibleInstance}

  clipCommandFilters(args: CommandFilterArgs): CommandFilters {
    const filters: CommandFilters = []
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
    const containerRects = this.containerRects(containerRectArgs)
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

    //  console.log(this.constructor.name, 'clipCommandFilters', hasColorContent, tweening)
   
    if (hasColorContent) {
      if (!tweening.canColor) {
        // inject color filter, since container cannot colorize itself
        filters.push(...container.containerColorCommandFilters(containerArgs))
        containerArgs.filterInput = arrayLast(arrayLast(filters).outputs)
      }
    } else {
      filters.push(...content.commandFilters(containerArgs, tweening))
      containerArgs.filterInput = arrayLast(arrayLast(filters).outputs)
    }
    // console.log(this.constructor.name, 'clipCommandFilters', filters)

    filters.push(...container.commandFilters(containerArgs, tweening, true))
     
    return filters
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
}

export class ServerTrackClass extends TrackClass implements ServerTrack {
  declare clips: ServerClips
  declare mash: ServerMashAsset
}
import type { AVType, AbsolutePath, AudibleCommandFilterArgs, AudioCommandFileArgs, Clip, Clips, CommandFiles, CommandFilter, CommandFilters, CommandInput, CommandInputRecord, DataOrError, EncodeDescription, MashAsset, PrecodeDescription, RawType, ServerMashDescription, ServerPromiseArgs, Size, Time, TimeRange, VideoCommandFileOptions, VideoCommandFilterArgs } from '@moviemasher/shared-lib/types.js'
import type { ServerSegmentDescription, ServerSegmentDescriptionArgs } from '../types.js'

import { $AUDIO, $IMAGE, $VIDEO, ERROR, RGBA_BLACK_ZERO, arrayLast, assertAsset, errorThrow, idGenerate, promiseNumbers, sortByTrack, sortByType } from '@moviemasher/shared-lib/runtime.js'
import { isAboveZero } from '@moviemasher/shared-lib/utility/guard.js'
import { assertDefined, assertTrue } from '@moviemasher/shared-lib/utility/guards.js'
import { isTimeRange, timeRangeFromTime } from '@moviemasher/shared-lib/utility/time.js'
import { isServerClip } from '../utility/guard.js'

const BACKCOLOR = 'BACKCOLOR'

const SILENCE = 'SILENCE'

export class ServerSegmentDescriptionClass implements ServerSegmentDescription {
  constructor(protected args: ServerSegmentDescriptionArgs) {}

  declare assetType: RawType

  get assetsServerPromise(): Promise<DataOrError<number>> {
    // raw assets are already cached on disk, so write other command files
    const { commandFiles, time, visible, size } = this
    const args: ServerPromiseArgs = { visible, audible: !visible, time, size, commandFiles }
    const promises = commandFiles.map(commandFile => {
      const { asset } = commandFile
      assertAsset(asset)

      // console.log(this.constructor.name, 'assetsServerPromise', asset.label, commandFile.type)
      return asset.commandFilePromise(args, commandFile)
    })
    return promiseNumbers(promises)
  }
  get audible(): boolean { return this.avType === $AUDIO }

  get visible(): boolean { return this.avType === $VIDEO }

  get avType(): AVType { 
    switch (this.assetType) {
      case $AUDIO: return $AUDIO
      case $IMAGE:
      case $VIDEO: return $VIDEO
    }
  }

  get clip(): Clip | undefined { return this.args.clip }
  
  private _clips?: Clips

  protected get clips() { return this._clips ||= this.clipsInitialize }
  
  private get clipsInitialize() {
    const { time, mash, avType, clip } = this
    return clip ? [clip] : mash.clipsInTimeOfType(time, avType).sort(sortByTrack)
  }

  private _commandFiles?: CommandFiles

  protected get commandFiles(): CommandFiles {
    return this._commandFiles ||= this.commandFilesInitialize
  }

  protected get commandFilesInitialize(): CommandFiles {
    return []
  }

  get encodeDescription(): EncodeDescription { 
    const { inputs: inputsById, filters: commandFilters, duration, avType } = this
    return { inputsById, commandFilters, duration, avType }
  }

  get duration(): number { 
    const { time } = this
    return isTimeRange(time) ? time.lengthSeconds : 0
  }

  protected get encodePath(): AbsolutePath { return this.mashDescription.encodePath }

  get filters(): CommandFilters { 
    return errorThrow(ERROR.Unimplemented)
  }

  _id?: string
  get id() { return this._id ||= idGenerate(this.assetType)}
  
  get inputCommandFiles(): CommandFiles { 
    return this.commandFiles.filter(file => file.avType) 
  }

  get inputs(): CommandInputRecord {
    const entries = this.inputCommandFiles.map(commandFile => {
      const { path, inputId, file, inputOptions, outputOptions, avType } = commandFile
      const source = path || file
      assertDefined(avType)

      const input: CommandInput = { avType, source, inputOptions, outputOptions }
      return [inputId, input]
    })
    return Object.fromEntries(entries)
  }
  
  protected get mash(): MashAsset { return this.mashDescription.mash }

  protected get mashDescription(): ServerMashDescription { return this.args.mashDescription }
  
  get precodeDescription(): PrecodeDescription { 
    const { inputs: inputsById, filters: commandFilters, duration, clip } = this
    assertDefined(clip)
    return { inputsById, commandFilters, duration, clip }
  }

  protected get size(): Size { return this.mashDescription.size }

  get time(): Time { return this.args.time }


}

export class AudioServerSegmentDescriptionClass extends ServerSegmentDescriptionClass {
  constructor(public args: ServerSegmentDescriptionArgs) {
    super(args)
    assertTrue(isAboveZero(this.audioRate), 'audioRate')
  }
  
  assetType = $AUDIO 

  private get audioRate(): number { return this.mashDescription.audioRate }

  protected override get commandFilesInitialize(): CommandFiles {
    // console.log(this.constructor.name, 'commandFilesInitialize')
    const { time, audioRate, clips } = this
    const commandFiles = clips.filter(isServerClip).flatMap(clip => {
      const clipTime = clip.timeRange
      const chainArgs: AudioCommandFileArgs = { 
        time, audioRate, clipTime
      }
      return clip.audioCommandFiles(chainArgs)
    })
    return commandFiles
  }

  private get commandFilterAudible(): CommandFilter {
    const { duration } = this
    const silenceCommandFilter: CommandFilter = {
      ffmpegFilter: 'aevalsrc',
      options: { exprs: 0, duration },
      inputs: [], outputs: [SILENCE]
    }
    if (duration) silenceCommandFilter.options.duration = duration
    return silenceCommandFilter
  }

  override get filters(): CommandFilters { 
    const filters: CommandFilters = []
    const { 
      time, clips, duration, audioRate, commandFiles
    } = this
    const chainArgs: AudibleCommandFilterArgs = { 
      commandFiles, duration,
      audioRate, time, 
      chainInput: '', clipTime: timeRangeFromTime(time), track: 0
    }
   
    filters.push(this.commandFilterAudible)
    chainArgs.chainInput = SILENCE
    const { length } = clips
    clips.filter(isServerClip).forEach((clip, index) => {
      chainArgs.clipTime = clip.timeRange
      chainArgs.track = index
      filters.push(...clip.audioCommandFilters(chainArgs))
    
      const lastFilter = arrayLast(filters)
      if (index < length - 1 ) {
        if (!lastFilter.outputs.length) lastFilter.outputs.push(idGenerate('clip'))
      }
      chainArgs.chainInput = arrayLast(lastFilter.outputs)
    })
    return filters
  }

  get time(): TimeRange { return super.time as TimeRange }

}

export class ImageServerSegmentDescriptionClass extends ServerSegmentDescriptionClass {
  constructor(public args: ServerSegmentDescriptionArgs) {
    super(args)
  }
  assetType = $IMAGE
}

export class VideoServerSegmentDescriptionClass extends ServerSegmentDescriptionClass {
  constructor(public args: ServerSegmentDescriptionArgs) {
    super(args)
    
    assertTrue(isAboveZero(this.videoRate), 'videoRate')
  }

  assetType = $VIDEO

  private get background(): string { return this.mashDescription.background }

  protected get commandFilesInitialize(): CommandFiles {
    // console.log(this.constructor.name, 'commandFilesInitialize')
    const { time, videoRate, size: outputSize, clips, encodePath } = this
    const files = clips.filter(isServerClip).flatMap(clip => {
      const options: VideoCommandFileOptions = { 
        time, outputSize, videoRate, encodePath
      }
      return clip.videoCommandFiles(options)
    })
    return files.sort(sortByType)
  }


  private get commandFilterVisible(): CommandFilter {
    const { duration, videoRate: rate, background, size } = this
    // console.log(this.constructor.name, this.id, 'commandFilterVisible size', size)
    const color = background || RGBA_BLACK_ZERO
    const commandFilter: CommandFilter = {
      ffmpegFilter: 'color',
      options: { color, rate, size: `${size.width}x${size.height}` },
      inputs: [], outputs: [BACKCOLOR]
    }
    if (duration) commandFilter.options.duration = duration
    return commandFilter
  }

  override get filters(): CommandFilters { 
    const { time, size, clips, duration, videoRate, encodePath, commandFiles } = this
    
    const filters: CommandFilters = [this.commandFilterVisible]
    const { length } = clips
    const chainArgs: VideoCommandFilterArgs = { 
      commandFiles, duration, videoRate, time, outputSize: size, encodePath,
      chainInput: BACKCOLOR, clipTime: timeRangeFromTime(time), track: 0
    }
    clips.filter(isServerClip).forEach((clip, index) => {
      chainArgs.clipTime = clip.timeRange
      chainArgs.track = index
      filters.push(...clip.videoCommandFilters(chainArgs))
      const lastFilter = arrayLast(filters)
      if (index < length - 1 && !lastFilter.outputs.length) {
        lastFilter.outputs.push(idGenerate('clip'))
      }
      chainArgs.chainInput = arrayLast(lastFilter.outputs)
    })
    return filters
  }

  get time(): TimeRange { return super.time as TimeRange }

  private get videoRate(): number { return this.mashDescription.videoRate }

}
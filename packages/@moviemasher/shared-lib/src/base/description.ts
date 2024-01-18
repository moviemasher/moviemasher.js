import type { AVType, AssetType, Clip, Clips, DataOrError, Elements, MashAsset, MashDescription, MashDescriptionArgs, Size, Time } from '../types.js'

import { AUDIO, BOTH, ERROR, IMAGE, VIDEO, errorThrow, isDefiniteError, sortByTrack } from '../runtime.js'
import { timeFromArgs, timeRangeFromArgs } from '../utility/time.js'
import { isBelowOne } from '../utility/guards.js'

export class MashDescriptionClass implements MashDescription {
  constructor(protected args: MashDescriptionArgs) {}

  protected get assetType(): AssetType { 
    return this.args.assetType || this.mash.type 
  }

  protected get avType(): AVType { 
    switch (this.assetType) {
      case AUDIO: return AUDIO
      case IMAGE: return VIDEO
      case VIDEO: return BOTH 
    }
  }

  protected get clip(): Clip | undefined { return this.args.clip }

  protected _clips?: Clips
  protected get clips(): Clips { return this._clips ||= this.clipsInitialize }
  private get clipsInitialize(): Clips {
    const { mash, time, clip, avType } = this
    if (clip) return [clip]
    
    return mash.clipsInTimeOfType(time, avType).sort(sortByTrack) 
  }
  
  private get frame(): number { return this.args.frame || 0 } 

  private get frames(): number {
    return this.args.frames || this.mash.totalFrames
  }

  get mash(): MashAsset { return errorThrow(ERROR.Unimplemented) }

  get quantize(): number { return this.mash.quantize }
  
  get size(): Size { return this.args.size || this.mash.size }

  private _time?: Time
  get time(): Time {
    const { _time } = this
    if (_time) return _time

    const { args, assetType } = this
    const isImage = assetType === IMAGE
    const { time } = args
    if (time) return this._time = isImage ? time.startTime : time
    
    const { frame, quantize } = this

    const frameTime = timeFromArgs(frame, quantize)
    if (isImage) return this._time = frameTime

    const { frames } = this
    if (isBelowOne(frames)) return frameTime // do not set until duration known
    
    return this._time = timeRangeFromArgs(frame, quantize, frames)
  }
}
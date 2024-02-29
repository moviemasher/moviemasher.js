import type { Asset, AssetCacheArgs, Clip, DataOrError, Instance, InstanceArgs, InstanceCacheArgs, InstanceObject, IntrinsicOptions, Strings, TargetId, Time, UnknownRecord } from '../types.js'

import { $CONTENT, ASSET_DURATION, DEFAULT_CONTAINER_ID, DEFAULT_CONTENT_ID, idGenerateString } from '../runtime.js'
import { assertAboveZero } from '../utility/guards.js'
import { timeFromArgs } from '../utility/time.js'
import { PropertiedClass } from './propertied.js'

export class InstanceClass extends PropertiedClass implements Instance {
  constructor(object: InstanceArgs) {
    super(object)
    const { asset } = object
    this.asset = asset 
  }

  declare asset: Asset
  
  get assetId(): string { return this.asset.id }

  get assetIds(): Strings {
    return [...this.asset.assetIds]
  }
  
  assetTime(mashTime: Time) : Time {
    const { timeRange: clipTimeRange } = this.clip
    const { fps, startTime, endTime } = clipTimeRange
    const scaledTime = mashTime.scaleToFps(fps) // may have fps higher than quantize and time.fps
    const frame = Math.max(Math.min(scaledTime.frame, endTime.frame), startTime.frame)
    return scaledTime.withFrame(frame - startTime.frame)
  }
  
  private _clip?: Clip
  get clip() { return this._clip! }
  set clip(value: Clip) { this._clip = value }

  frames(quantize: number): number {
    assertAboveZero(quantize, 'frames quantize') 

    return timeFromArgs(ASSET_DURATION, quantize).frame
  }

  hasIntrinsicTiming = false

  protected _id?: string
  get id(): string { return this._id ||= idGenerateString() } 

  instanceCachePromise(args: InstanceCacheArgs): Promise<DataOrError<number>> {
    const { time } = args
    const assetTime = this.assetTime(time)
    const options: AssetCacheArgs = { ...args, assetTime }
    return this.asset.assetCachePromise(options)
  }

  get instanceObject(): InstanceObject { return this.scalarRecord }

  intrinsicsKnown(_: IntrinsicOptions): boolean { return true }

  get isDefault() { 
    return [DEFAULT_CONTENT_ID, DEFAULT_CONTAINER_ID].includes(this.assetId) 
  }

  get canBeMuted() { return false }
  
  get muted(): boolean { return this.boolean('muted') }
  
  override targetId: TargetId = $CONTENT

  toJSON(): UnknownRecord {
    const { assetId } = this
    return { ...super.toJSON(), assetId }
  }
}

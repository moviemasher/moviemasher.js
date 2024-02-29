import type { Asset, AudibleAsset, AudibleInstance, Constrained, Instance, IntrinsicOptions, Numbers, Time } from '../types.js'

import { $ASSET, $BOOLEAN, $NUMBER, $PERCENT, $PROBE, DURATION_UNKNOWN, FRAMES_MINIMUM, isProbing } from '../runtime.js'
import { isAboveZero, isUndefined } from '../utility/guard.js'
import { assertAboveZero } from '../utility/guards.js'
import { timeFromSeconds } from '../utility/time.js'

export function AudibleAssetMixin<T extends Constrained<Asset>>(Base: T):
  T & Constrained<AudibleAsset> {
  return class extends Base implements AudibleAsset {
    constructor(...args: any[]) {
      super(...args)
      const { canBeMuted: audio } = this
      if (audio) {
        this.properties.push(this.propertyInstance({
          targetId: $ASSET, name: 'loop', type: $BOOLEAN,
        }))
      }
    }

    protected _canBeMuted?: boolean

    get canBeMuted(): boolean | undefined {
      if (isUndefined(this._canBeMuted)) {
        this._canBeMuted = this.decodings.some(object => object.data?.audible)
      }
      return Boolean(this._canBeMuted)
    }

    set canBeMuted(value: boolean | undefined) { this._canBeMuted = value }

    private _duration = 0

    get duration(): number {
      if (!isAboveZero(this._duration)) {
        const probing = this.decodings.find(decoding => decoding.type === $PROBE)
        if (isProbing(probing)) {
          const { data } = probing
          const { duration } = data
          if (isAboveZero(duration)) this._duration = duration
        } 
      }
      return this._duration
    }

    set duration(value: number) { this._duration = value }

    /**
     *
     * @param quantize
     * @returns Asset duration in frames with quantization.
     */
    frames(quantize: number): number {
      const { duration } = this
      if (!duration) return DURATION_UNKNOWN

      assertAboveZero(quantize)
      const { frame } = timeFromSeconds(duration, quantize, 'floor')
      return frame
    }

    override hasIntrinsicTiming = true
  }
}

export function AudibleInstanceMixin<T extends Constrained<Instance>>(Base: T):
  T & Constrained<AudibleInstance> {
  return class extends Base implements AudibleInstance {
    constructor(...args: any[]) {
      super(...args)
      const { asset, targetId } = this
      if (asset.canBeMuted) {
        this.properties.push(this.propertyInstance({
          targetId, name: 'muted', type: $BOOLEAN,
        }))
        this.properties.push(this.propertyInstance({
          targetId, name: 'gain', type: $PERCENT,
          defaultValue: 1, min: 0, max: 2, step: 0.01
        }))
        if (asset.value('loop')) {
          this.properties.push(this.propertyInstance({
            targetId, name: 'loops', type: $NUMBER,
            defaultValue: 1,
          }))
        }
      }
      this.properties.push(this.propertyInstance({
        targetId, name: 'speed', type: $PERCENT,
        defaultValue: 1, min: 0.5, max: 2, step: 0.01,
      }))
      this.properties.push(this.propertyInstance({
        targetId, name: 'startTrim', type: $PERCENT,
        defaultValue: 0, min: 0, max: 1, step: 0.01,
      }))
      this.properties.push(this.propertyInstance({
        targetId, name: 'endTrim', type: $PERCENT,
        defaultValue: 0, min: 0, max: 1, step: 0.01,
      }))
    }

    declare asset: AudibleAsset

    private assetFrame(quantize: number): number {
      const [durationFrames, startTrimFrame, endTrimFrame] = this.assetFrames(quantize)
      return durationFrames - (startTrimFrame + endTrimFrame)
    }

    assetFrames(quantize: number): Numbers {
      assertAboveZero(quantize)
      const startTrim = this.number('startTrim')
      const endTrim = this.number('endTrim')
      const { asset } = this
      const durationFrames = asset.frames(quantize)
      const availableFrames = durationFrames - FRAMES_MINIMUM
      const startTrimFrame = (startTrim * availableFrames)
      const endTrimFrame = (endTrim * availableFrames)
      return [durationFrames, startTrimFrame, endTrimFrame]
    }

    assetTime(mashTime: Time): Time {
      const superTime = super.assetTime(mashTime)
      const [_, startTrimFrame] = this.assetFrames(superTime.fps)
      const speed = this.number('speed')
      const spedFrame = Math.round(startTrimFrame + (superTime.frame * speed))
      return superTime.withFrame(spedFrame)
    }

    frames(quantize: number): number {
      return Math.round(this.assetFrame(quantize) / this.number('speed'))
    }

    override intrinsicsKnown(options: IntrinsicOptions): boolean {
      const superKnown = super.intrinsicsKnown(options)
      if (!superKnown) return false

      const { duration } = options
      if (!duration) return true

      return isAboveZero(this.asset.duration)
    }

    get canBeMuted() { return !!this.asset.canBeMuted }
  }
}

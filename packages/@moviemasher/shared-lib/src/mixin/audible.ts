import type { Asset, AudibleAsset, AudibleAssetObject, AudibleInstance, AudibleInstanceObject, Constrained, Instance, IntrinsicOptions, Numbers, Time, UnknownRecord, Value } from '../types.js'

import { $ASSET, $BOOLEAN, COMMA, $CONTAINER, $CONTENT, DURATION_UNKNOWN, FRAMES_MINIMUM, $NUMBER, $PERCENT, $PROBE, arrayOfNumbers, isProbing } from '../runtime.js'
import { isString } from '../utility/guard.js'
import { isUndefined } from '../utility/guard.js'
import { assertAboveZero } from '../utility/guards.js'
import { isAboveZero, isPositive } from '../utility/guard.js'
import { timeFromSeconds } from '../utility/time.js'


const gainFromString = (gain: Value): number | Numbers[] => {
  if (isString(gain)) {
    if (gain.includes(COMMA)) {
      const floats = gain.split(COMMA).map(string => parseFloat(string))
      const z = floats.length / 2
      return arrayOfNumbers(z).map(i => [floats[i * 2], floats[i * 2 + 1]])
    }  
    const parsed = Number(gain)
    if (isPositive(parsed)) return parsed
  } else if (isPositive(gain)) return gain
  return 1.0
}


export function AudibleAssetMixin<T extends Constrained<Asset>>(Base: T):
  T & Constrained<AudibleAsset> {
  return class extends Base implements AudibleAsset {
    private _canBeMuted?: boolean
    get canBeMuted(): boolean {
      if (isUndefined(this._canBeMuted)) {
        this._canBeMuted = this.decodings.some(object => object.data?.audible)
      }
      return Boolean(this._canBeMuted)
    }
    set canBeMuted(value: boolean) { this._canBeMuted = value }

    audioUrl = ''

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

    override initializeProperties(object: AudibleAssetObject): void {
      const { canBeMuted: audio } = this
      if (audio) {
        this.properties.push(this.propertyInstance({
          targetId: $ASSET,
          name: 'loop', type: $BOOLEAN,
        }))
        this.properties.push(this.propertyInstance({
          targetId: $ASSET, name: 'muted', type: $BOOLEAN,
        }))
        this.properties.push(this.propertyInstance({
          targetId: $ASSET, name: 'gain', type: $PERCENT,
          defaultValue: 1, min: 0, max: 2, step: 0.01
        }))
      }
      super.initializeProperties(object)
    }

    loop = false

    toJSON(): UnknownRecord {
      console.debug(this.constructor.name, 'toJSON')
      const { loop } = this
      return { ...super.toJSON(), loop }
    }
  }
}

export function AudibleInstanceMixin<T extends Constrained<Instance>>(Base: T):
  T & Constrained<AudibleInstance> {
  return class extends Base implements AudibleInstance {
    constructor(...args: any[]) {
      super(...args)
      const [object] = args
      const { gain } = object as AudibleInstanceObject

      if (typeof gain != 'undefined') {
        const parsed = gainFromString(gain)
        if (isPositive(parsed)) this.gain = parsed
        else {
          this.gain = -1
          this.gainPairs = parsed
        }
      }
    }

    declare asset: AudibleAsset

    private assetFrame(quantize: number): number {
      const [durationFrames, startTrimFrame, endTrimFrame] = this.assetFrames(quantize)
      return durationFrames - (startTrimFrame + endTrimFrame)
    }

    assetFrames(quantize: number): Numbers {
      assertAboveZero(quantize)
      const { startTrim, endTrim, asset } = this

      const durationFrames = asset.frames(quantize)
      const availableFrames = durationFrames - FRAMES_MINIMUM
      const startTrimFrame = (startTrim * availableFrames)
      const endTrimFrame = (endTrim * availableFrames)
      return [durationFrames, startTrimFrame, endTrimFrame]
    }

    assetTime(mashTime: Time): Time {
      const superTime = super.assetTime(mashTime)
      const [_, startTrimFrame] = this.assetFrames(superTime.fps)
      const { speed } = this
      const spedFrame = Math.round(startTrimFrame + (superTime.frame * speed))
      return superTime.withFrame(spedFrame)
    }

    declare endTrim: number

    frames(quantize: number): number {
      return Math.round(this.assetFrame(quantize) / this.speed)
    }

    declare gain: number

    gainPairs: Numbers[] = []

    hasGain(): boolean {
      if (this.gain === 0) return true
      if (isPositive(this.gain)) return false

      if (this.gainPairs.length !== 2) return false

      const [first, second] = this.gainPairs
      if (first.length !== 2) return false
      if (second.length !== 2) return false
      if (Math.max(...first)) return false
      const [time, value] = second
      return time === 1 && value === 0
    }

    hasIntrinsicTiming = true

    override initializeProperties(object: unknown): void {
      const { asset, container } = this
      const targetId = container ? $CONTAINER : $CONTENT
      if (asset.canBeMuted) {
        this.properties.push(this.propertyInstance({
          targetId, name: 'muted', type: $BOOLEAN,
        }))
        if (asset.loop) {
          this.properties.push(this.propertyInstance({
            targetId, name: 'loops', type: $NUMBER,
            defaultValue: 1,
          }))
        }
        this.properties.push(this.propertyInstance({
          targetId, name: 'gain', type: $PERCENT,
          defaultValue: 1, min: 0, max: 2, step: 0.01
        }))
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
      super.initializeProperties(object)
    }

    override intrinsicsKnown(options: IntrinsicOptions): boolean {
      const superKnown = super.intrinsicsKnown(options)
      if (!superKnown) return false

      const { duration } = options
      if (!duration) return true

      return isAboveZero(this.asset.duration)
    }

    override get canBeMuted() { return this.asset.canBeMuted }


    declare speed: number

    declare startTrim: number

    toJSON(): UnknownRecord {
      const json = super.toJSON()
      const { speed, gain } = this
      if (speed !== 1) json.speed = speed
      if (gain !== 1) json.gain = gain
      return json
    }
  }
}


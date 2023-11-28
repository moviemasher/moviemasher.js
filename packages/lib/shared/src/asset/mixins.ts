import type { Asset, AudibleAsset, AudibleAssetObject, AudioAsset, ColorAsset, Constrained, EndpointRequest, ImageAsset, InstanceArgs, RawAsset, ShapeAsset, ShapeAssetObject, Size, TextAsset, TextAssetObject, TextInstanceObject, UnknownRecord, VideoAsset, VisibleAsset } from '@moviemasher/runtime-shared'

import { ASSET_TARGET, AUDIO, BOOLEAN, DURATION_UNKNOWN, IMAGE, MAINTAIN, PERCENT, PROBE, TEXT, VIDEO, WIDTH, isProbing, isUndefined } from '@moviemasher/runtime-shared'

import { assertAboveZero, isAboveZero } from '../utility/guards.js'
import { sizeSvgD } from '../utility/rect.js'
import { timeFromSeconds } from '../utility/time.js'

export function AudibleAssetMixin
<T extends Constrained<Asset>>(Base: T): 
T & Constrained<AudibleAsset> {
  return class extends Base implements AudibleAsset {
    private _audio?: boolean
    get audio(): boolean { 
      if (isUndefined(this._audio)) {
        this._audio = this.decodings.some(object => object.data?.audible)
      }
      return Boolean(this._audio)
    }
    set audio(value: boolean) { this._audio = value }


    audioUrl = ''

    private _duration = 0
    get duration(): number {
      if (!isAboveZero(this._duration)) {
        const probing = this.decodings.find(decoding => decoding.type === PROBE)
        // console.debug(this.constructor.name, 'duration', probing, probing?.data?.duration)
        if (isProbing(probing)) {
          const { data } = probing
          const { duration } = data
          if (isAboveZero(duration)) this._duration = duration
        
        } else {
          // console.warn(this.constructor.name, 'no duration no probing', this.decodings)
        }
      }
      return this._duration
    }
    set duration(value: number) { this._duration = value }

    frames(quantize: number): number {
      const { duration } = this
      if (!duration) return DURATION_UNKNOWN

      assertAboveZero(quantize)
      const { frame } = timeFromSeconds(duration, quantize, 'floor')
      // console.log(this.constructor.name, 'frames', frame, { duration, quantize })

      return frame
    }

    override initializeProperties(object: AudibleAssetObject): void {
      const { audio } = this
      if (audio) { 
        this.properties.push(this.propertyInstance({ 
          targetId: ASSET_TARGET,
          name: 'loop', type: BOOLEAN,
        }))
        this.properties.push(this.propertyInstance({ 
          targetId: ASSET_TARGET, name: 'muted', type: BOOLEAN, 
        }))
        this.properties.push(this.propertyInstance({ 
          targetId: ASSET_TARGET, name: 'gain', type: PERCENT,
          defaultValue: 1.0, min: 0, max: 2.0, step: 0.01 
        }))
      }
      super.initializeProperties(object)
    }
    
    loop = false

    toJSON() : UnknownRecord {
      const { loop } = this
      return { ...super.toJSON(), loop }
    }
  }
}

export function AudioAssetMixin<T extends Constrained<AudibleAsset>>(Base: T):
  T & Constrained<AudioAsset> {
  return class extends Base implements AudioAsset {
    canBeContainer = false;

    type = AUDIO;
  }
}

export function ColorAssetMixin<T extends Constrained<Asset>>(Base: T):
  T & Constrained<ColorAsset> {
  return class extends Base implements ColorAsset {
    canBeContainer = false;

    container = false;

    type = IMAGE;
  }
}

export function ImageAssetMixin<T extends Constrained<VisibleAsset>>(Base: T):
  T & Constrained<ImageAsset> {
  return class extends Base implements ImageAsset {
    type = IMAGE;
  }
}

export function VideoAssetMixin<T extends Constrained<AudibleAsset & VisibleAsset>>(Base: T):
  T & Constrained<VideoAsset> {
  return class extends Base implements VideoAsset {
    type = VIDEO;
  }
}

export function VisibleAssetMixin<T extends Constrained<Asset>>(Base: T):
  T & Constrained<VisibleAsset> {
  return class extends Base implements VisibleAsset {
    alpha?: boolean

    get sourceSize(): Size | undefined {
      const decoding = this.decodings.find(decoding => decoding.type === PROBE)
      if (isProbing(decoding)) {
        const { data } = decoding
        if (data) {
          const { width, height } = data
          if (isAboveZero(width) && isAboveZero(height)) return { width, height }
        }
      }
      return undefined
    }
  }
}

export function RawAssetMixin<T extends Constrained<Asset>>(Base: T):
  T & Constrained<RawAsset> {
  return class extends Base implements RawAsset {
    declare request: EndpointRequest
  }
}
export function ShapeAssetMixin<T extends Constrained<VisibleAsset>>(Base: T):
  T & Constrained<ShapeAsset> {
  return class extends Base implements ShapeAsset {
    canBeContent = false;

    content = false;

    override initializeProperties(object: ShapeAssetObject) {
      const { path, pathHeight, pathWidth } = object as ShapeAssetObject
      this.pathWidth = isAboveZero(pathWidth) ? pathWidth : 100
      this.pathHeight = isAboveZero(pathHeight) ? pathHeight : 100
      this.path = path || sizeSvgD(this.pathSize)
      super.initializeProperties(object)
    }

    isVector = true;

    declare path: string

    declare pathHeight: number

    declare pathWidth: number

    get pathSize(): Size {
      return { width: this.pathWidth, height: this.pathHeight }
    }

    toJSON(): UnknownRecord {
      const object = super.toJSON()
      if (this.path) object.path = this.path
      if (isAboveZero(this.pathHeight)) object.pathHeight = this.pathHeight
      if (isAboveZero(this.pathWidth)) object.pathWidth = this.pathWidth
      return object
    }

    type = IMAGE;
  }
}
export function TextAssetMixin<T extends Constrained<Asset>>(Base: T):
  T & Constrained<TextAsset> {
  return class extends Base implements TextAsset {
    canBeContent = false;

    protected _family = '';
    get family(): string { return this._family }
    set family(value: string) { this._family = value }

    override initializeProperties(object: TextAssetObject): void {
      const { string, label } = object

      this.string = string || label || TEXT

      super.initializeProperties(object)
    }

    instanceArgs(object?: TextInstanceObject): TextInstanceObject & InstanceArgs {
      const textObject = object || {}
      if (isUndefined(textObject.lock)) textObject.lock = WIDTH
      if (isUndefined(textObject.sizeAspect)) textObject.sizeAspect = MAINTAIN
      if (isUndefined(textObject.pointAspect)) textObject.pointAspect = MAINTAIN
      return super.instanceArgs(textObject)
    }

    isVector = true;

    declare request: EndpointRequest

    declare string: string

    type = IMAGE;
  }
}


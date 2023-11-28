import type { AudibleAsset, AudibleInstance, AudibleInstanceObject, AudioAsset, AudioInstance, ColorAsset, ColorInstance, ColorInstanceObject, Constrained, ContentRectArgs, ImageAsset, ImageInstance, Instance, IntrinsicOptions, Numbers, Property, PropertySize, Rect, Scalar, ShapeAsset, ShapeInstance, ShapeInstanceObject, TextAsset, TextInstance, TextInstanceObject, Time, UnknownRecord, Value, VideoInstance, VisibleAsset, VisibleInstance, VisibleInstanceObject } from '@moviemasher/runtime-shared'

import { BOOLEAN, COMMA, CONTAINER, CONTENT, DOT, END, FRAME, HEIGHT, NUMBER, PERCENT, POINT_ZERO, RECT_ZERO, RGB, RGB_GRAY, SIZE_ZERO, STRING, VIDEO, WIDTH, isString } from '@moviemasher/runtime-shared'
import { arrayOfNumbers } from '@moviemasher/runtime-shared'
import { assertAboveZero, isAboveZero, isPositive, isPropertyId } from '../utility/guards.js'
import { timeFromSeconds } from '../utility/time.js'
import { rectFromSize } from '../utility/rect.js'
import { isRect } from '../utility/guards.js'
import { sizeAboveZero } from '../utility/rect.js'

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

export function AudibleInstanceMixin
<T extends Constrained<Instance>>(Base: T): 
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

    assetTime(mashTime: Time): Time {
      const superTime = super.assetTime(mashTime)
      const { startTrim, endTrim, asset:definition, speed } = this
      const { duration } = definition
      assertAboveZero(duration)

      const durationTime = timeFromSeconds(duration, superTime.fps)
      const durationFrames = durationTime.frame - (startTrim + endTrim)
      const offset = superTime.frame % durationFrames
      return superTime.withFrame(offset + startTrim).divide(speed) 
    }

    declare endTrim: number

    frames(quantize: number): number {
      assertAboveZero(quantize)

      const { asset, startTrim, endTrim } = this
      const frames = asset.frames(quantize)
      return frames - (startTrim + endTrim)
    }

    declare gain: number

    gainPairs: Numbers[] = []

    // graphFiles(args: CacheArgs): GraphFiles {
    //   const { audible } = args
    //   if (!audible) return []
    //   if (!(this.mutable() && !this.muted)) return []

    //   const { asset: definition } = this
    //   const graphFile: GraphFile = {
    //     type: AUDIO, file: '', definition, input: true
    //   }
    //   return [graphFile]
    // }
    
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
      const { asset } = this
      if (asset.audio) {
        this.properties.push(this.propertyInstance({ 
          targetId: CONTENT, name: 'muted', type: BOOLEAN, 
        }))
        if (asset.loop) {
          this.properties.push(this.propertyInstance({ 
            targetId: CONTENT, name: 'loops', type: NUMBER, 
            defaultValue: 1, 
          }))
        }
        this.properties.push(this.propertyInstance({ 
          targetId: CONTENT, name: 'gain', type: PERCENT, 
          defaultValue: 1.0, min: 0, max: 2.0, step: 0.01 
        }))
      }
      this.properties.push(this.propertyInstance({ 
        targetId: CONTENT, name: 'speed', type: PERCENT, 
        defaultValue: 1.0, min: 0.1, max: 2.0, step: 0.1, 
      }))
      this.properties.push(this.propertyInstance({ 
        targetId: CONTENT, name: 'startTrim', type: FRAME,
        defaultValue: 0, step: 1, min: 0, 
      }))
      this.properties.push(this.propertyInstance({ 
        targetId: CONTENT, name: 'endTrim', type: FRAME,
        defaultValue: 0, step: 1, min: 0, 
      }))
      super.initializeProperties(object)
    }

    intrinsicsKnown(options: IntrinsicOptions): boolean {
      const superKnown = super.intrinsicsKnown(options)
      if (!superKnown) return false

      const { duration } = options
      if (!duration) return true
      
      return isAboveZero(this.asset.duration)
    }

    mutable() { return this.asset.audio }

    override setValue(id: string, value?: Scalar, property?: Property | undefined): void {
      super.setValue(id, value, property)
      if (property) return

      const name = isPropertyId(id) ? id.split(DOT).pop() : id

      switch (name) {
        case 'startTrim':
        case 'endTrim':
        case 'speed':
          // console.log(this.constructor.name, 'setValue', name, value)
            
          this.clip.resetTiming(this)
          break
      
      }
    }

    declare speed: number

    declare startTrim: number

    toJSON(): UnknownRecord {
      const json = super.toJSON()
      const { speed, gain } = this
      if (speed !== 1.0) json.speed = speed
      if (gain !== 1.0) json.gain = gain
      return json
    }
  }
}

export function AudioInstanceMixin<T extends Constrained<AudibleInstance>>(Base: T):
  T & Constrained<AudioInstance> {
  return class extends Base implements AudioInstance {
    declare asset: AudioAsset;
  };
}

export function ColorInstanceMixin<T extends Constrained<Instance>>(Base: T):
  T & Constrained<ColorInstance> {
  return class extends Base implements ColorInstance {
    declare asset: ColorAsset

    declare color: string

    override initializeProperties(object: ColorInstanceObject): void {
      this.properties.push(this.propertyInstance({
        targetId: CONTENT, name: 'color', type: RGB,
        defaultValue: RGB_GRAY, tweens: true,
      }))
      this.properties.push(this.propertyInstance({
        targetId: CONTENT, name: `color${END}`,
        type: RGB, undefinedAllowed: true, tweens: true,
      }))
      super.initializeProperties(object)
    }
    intrinsicRect(_ = false): Rect { return RECT_ZERO }

    intrinsicsKnown(options: IntrinsicOptions): boolean { return true }
  }
}

export function ImageInstanceMixin<T extends Constrained<VisibleInstance>>(Base: T):
  T & Constrained<ImageInstance> {
  return class extends Base implements ImageInstance {
    declare asset: ImageAsset
  }
}

export function ShapeInstanceMixin<T extends Constrained<VisibleInstance>>(Base: T):
  T & Constrained<ShapeInstance> {
  return class extends Base implements ShapeInstance {
    declare asset: ShapeAsset

    hasIntrinsicSizing = true;

    override initializeProperties(object: ShapeInstanceObject) {
      this.properties.push(this.propertyInstance({
        targetId: CONTAINER, name: WIDTH, type: PERCENT,
        min: 0, max: 2, step: 0.01,
        defaultValue: 1, tweens: true,
      }))
      this.properties.push(this.propertyInstance({
        targetId: CONTAINER, name: `${WIDTH}${END}`,
        type: PERCENT, min: 0, max: 2, step: 0.01,
        undefinedAllowed: true, tweens: true,
      }))
      this.properties.push(this.propertyInstance({
        targetId: CONTAINER, name: HEIGHT, type: PERCENT,
        min: 0, max: 2, step: 0.01, tweens: true,
        defaultValue: 1,
      }))
      this.properties.push(this.propertyInstance({
        targetId: CONTAINER, name: `${HEIGHT}${END}`,
        type: PERCENT, undefinedAllowed: true, tweens: true,
        min: 0, max: 2, step: 0.01,
      }))
      super.initializeProperties(object)
    }

    intrinsicRect(_editing = false): Rect {
      const { pathHeight: height, pathWidth: width } = this.asset
      // console.log(this.constructor.name, 'intrinsicRect', this.assetId)
      return { width, height, ...POINT_ZERO }
    }

    intrinsicsKnown(options: IntrinsicOptions): boolean { return true }
  }
}

export function TextInstanceMixin<T extends Constrained<VisibleInstance>>(Base: T):
  T & Constrained<TextInstance> {
  return class extends Base implements TextInstance {
    constructor(...args: any[]) {
      const [object] = args
      object.lock ||= ''
      super(object)

      const { intrinsic } = object as TextInstanceObject
      if (isRect(intrinsic)) this.intrinsic = intrinsic
    }

    declare asset: TextAsset

    hasIntrinsicSizing = true;

    override initializeProperties(object: TextInstanceObject): void {
      this.properties.push(this.propertyInstance({
        targetId: CONTAINER, name: 'string', type: STRING,
        defaultValue: this.asset.string,
      }))
      this.properties.push(this.propertyInstance({
        targetId: CONTAINER, name: HEIGHT, type: PERCENT,
        min: 0, max: 2, step: 0.01, defaultValue: 0.3, tweens: true,
      }))
      this.properties.push(this.propertyInstance({
        targetId: CONTAINER, name: `${HEIGHT}${END}`,
        type: PERCENT, undefinedAllowed: true, tweens: true,
      }))
      this.properties.push(this.propertyInstance({
        targetId: CONTAINER, name: WIDTH, type: PERCENT,
        min: 0, max: 2, step: 0.01, tweens: true,
        defaultValue: 0.8,
      }))
      this.properties.push(this.propertyInstance({
        targetId: CONTAINER, name: `${WIDTH}${END}`,
        min: 0, max: 1, step: 0.01,
        type: PERCENT, undefinedAllowed: true, tweens: true,
      }))
      super.initializeProperties(object)
    }

    intrinsic?: Rect

    intrinsicRect(_ = false): Rect { return this.intrinsic! }

    intrinsicsKnown(options: IntrinsicOptions): boolean {
      const { size } = options
      if (!size || isRect(this.intrinsic) || this.asset.family) {
        // console.log(this.constructor.name, 'intrinsicsKnown', this.intrinsic, this.asset.family)
        return true
      }
      return false
    }

    declare string: string

    toJSON(): UnknownRecord {
      const json = super.toJSON()
      json.intrinsic = this.intrinsicRect(true)
      return json
    }
  }
}

export function VideoInstanceMixin<T extends Constrained<AudibleInstance & VisibleInstance>>(Base: T):
  T & Constrained<VideoInstance> {
  return class extends Base implements VideoInstance {
    type = VIDEO;
  }
}

export function VisibleInstanceMixin<T extends Constrained<Instance>>(Base: T):
  T & Constrained<VisibleInstance> {
  return class extends Base implements VisibleInstance {
    declare asset: VisibleAsset

    colorMaximize = true;

    hasIntrinsicSizing = true;

    override initializeProperties(object: VisibleInstanceObject): void {

      const { container } = object
      const hasDimensions = container || !this.isDefault
      if (hasDimensions) {
        const { properties } = this
        const hasWidth = properties.some(property => property.name.endsWith(WIDTH))
        const hasHeight = properties.some(property => property.name.endsWith(HEIGHT))
        const min = container ? 0 : 1
        const targetId = container ? CONTAINER : CONTENT
        if (!hasWidth) {
          this.properties.push(this.propertyInstance({
            targetId, name: WIDTH, type: PERCENT,
            defaultValue: 1, min, max: 2, step: 0.01, tweens: true,
          }))
          this.properties.push(this.propertyInstance({
            targetId, name: `${WIDTH}${END}`, type: PERCENT,
            step: 0.01, max: 2, min, undefinedAllowed: true, tweens: true,
          }))
        }
        if (!hasHeight) {
          this.properties.push(this.propertyInstance({
            targetId, name: HEIGHT, type: PERCENT,
            defaultValue: 1, max: 2, min, step: 0.01, tweens: true,
          }))
          this.properties.push(this.propertyInstance({
            targetId, name: `${HEIGHT}${END}`, type: PERCENT,
            step: 0.01, max: 2, min, undefinedAllowed: true, tweens: true,
          }))
        }
      }
      super.initializeProperties(object)
    }

    intrinsicRect(_editing?: boolean): Rect {
      const { sourceSize: size = SIZE_ZERO } = this.asset
      // assertSizeAboveZero(size)
      const rect = { ...POINT_ZERO, ...size }
      // console.log(this.constructor.name, 'intrinsicRect', editing, rect)
      return rect
    }

    intrinsicsKnown(options: IntrinsicOptions): boolean {
      if (options.size) return sizeAboveZero(this.asset.sourceSize)

      return super.intrinsicsKnown(options)
    }

    itemContentRect(containerRect: Rect, shortest: PropertySize, time: Time): Rect {
      // console.log(this.constructor.name, 'itemContentRect', containerRect)
      const timeRange = this.clip.timeRange

      const contentArgs: ContentRectArgs = {
        containerRects: [containerRect, containerRect], time, timeRange, editing: true, shortest
      }
      const [contentRect] = this.contentRects(contentArgs)
      const { x, y } = contentRect
      const point = { x: containerRect.x - x, y: containerRect.y - y }
      const rect = rectFromSize(contentRect, point)
      return rect
    }
  }
}

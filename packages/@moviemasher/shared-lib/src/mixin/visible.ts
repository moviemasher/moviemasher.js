import type { Asset, ClipObject, ComplexSvgItem, Constrained, ContentFill, ContentRectArgs, DataOrError, Instance, InstanceObject, IntrinsicOptions, PropertySize, Rect, Size, SvgItem, SvgItemArgs, SvgItems, SvgVector, Time, TimeRange, Transparency, VisibleAsset, VisibleInstance, VisibleInstanceObject } from '../types.js'

import { $OPACITY, $POINT, $SIZE, AUDIO, CONTAINER, CONTENT, DASH, DEFAULT_CONTAINER_ID, END, ERROR, HEIGHT, NONE, PERCENT, POINT_KEYS, POINT_ZERO, PROBE, SIZE_KEYS, SIZE_ZERO, WIDTH, isDefined, isDefiniteError, isProbing, isUndefined, namedError } from '../runtime.js'
import { assertPositive, isAboveZero, isBelowOne, isComplexSvgItem, isPositive, isScalar } from '../utility/guards.js'
import { sizeAboveZero } from '../utility/rect.js'
import { svgClipPathElement, svgColorMatrix, svgFilterElement, svgMaskElement, svgPolygonElement } from '../utility/svg.js'


export function VisibleAssetMixin<T extends Constrained<Asset>>(Base: T):
  T & Constrained<VisibleAsset> {
  return class extends Base implements VisibleAsset {
    alpha?: boolean

    canBeFill?: boolean
    canBeContainer?: boolean

    canBeContent?: boolean

    container?: boolean

    content?: boolean

    isVector?: boolean

    get probeSize(): Size | undefined {
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

    override clipObject(object: InstanceObject = {}): ClipObject {
      const clipObject: ClipObject = {}
      const { id, type, canBeContainer, canBeContent } = this
      if (canBeContainer && !canBeContent) {
        clipObject.sizing = CONTAINER
        clipObject.containerId = id
        clipObject.container = object
      } else {
        clipObject.sizing = CONTENT
        clipObject.contentId = id
        clipObject.content = object
        if (type !== AUDIO) clipObject.containerId = DEFAULT_CONTAINER_ID
      }
      return clipObject
    }
  }
}


export function VisibleInstanceMixin<T extends Constrained<Instance>>(Base: T):
  T & Constrained<VisibleInstance> {
  return class extends Base implements VisibleInstance {
    declare asset: VisibleAsset

    containerSvgItem(args: SvgItemArgs): DataOrError<SvgItem | ComplexSvgItem> {
      // console.log(this.constructor.name, 'VisibleInstanceMixin,containerSvgItem', args)
      const orError = this.svgItem(args)
      if (isDefiniteError(orError)) return orError

      const { data: item } = orError
      const { time, timeRange, size, rect } = args
      const complex = isComplexSvgItem(item) ? item : { svgItem: item }
      const { svgItem } = complex
      const filter = this.containerOpacityFilter(svgItem, size, rect, time, timeRange)
      if (filter) {
        complex.defs ||= []
        const { defs } = complex
        defs.push(filter)
      }
      return { data: complex }
    }

    containerOpacityFilter(svgItem: SvgItem, _outputSize: Size, _containerRect: Rect, time: Time, clipTime: TimeRange): SVGFilterElement | undefined {
      const [opacity] = this.tweenValues($OPACITY, time, clipTime)
      if (!isBelowOne(opacity)) return

      assertPositive(opacity)

      const values = `1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${opacity} 0`
      const filterElement = svgColorMatrix(values)
      const id =  [$OPACITY, this.asset.id].join(DASH)
      return svgFilterElement([filterElement], svgItem, id)
    }

    colorMaximize = true

    contentSvgItem(args: SvgItemArgs): DataOrError<SvgItem | ComplexSvgItem> {
      const { rect: containerRect, time, size } = args
      const shortest = size.width < size.height ? WIDTH : HEIGHT
      const rect = this.itemContentRect(containerRect, shortest, time)
      return this.svgItem({...args, rect })
    }

    hasIntrinsicSizing = true

    override initializeProperties(object: VisibleInstanceObject): void {
      const { container } = this
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

    override get intrinsicRect(): Rect {
      const { probeSize = SIZE_ZERO } = this.asset
      return { ...POINT_ZERO, ...probeSize }
    }

    override intrinsicsKnown(options: IntrinsicOptions): boolean {
      if (options.size) return sizeAboveZero(this.asset.probeSize)

      return super.intrinsicsKnown(options)
    }

    itemContentRect(containerRect: Rect, shortest: PropertySize, time: Time): Rect {
      const contentRectArgs: ContentRectArgs = {
        containerRects: [containerRect, containerRect], 
        shortest, time, timeRange: this.clip.timeRange
      }
      const [contentRect] = this.contentRects(contentRectArgs)

      return contentRect
    }

    pathElement(rect: Rect, forecolor = NONE): SvgVector {
      return svgPolygonElement(rect, '', forecolor)
    }

    svgItem(args: SvgItemArgs): DataOrError<SvgItem | ComplexSvgItem> {
      const { rect, color } = args
      return { data: this.pathElement(rect, color) }
    }

    get tweening(): boolean {
      let tweening = this.tweens($SIZE)
      tweening ||= this.tweens($POINT)
      tweening ||= this.tweens($OPACITY)
      return tweening
    }

    tweens(key: string): boolean {
      switch (key) {
        case $SIZE: return SIZE_KEYS.some(key =>  this.tweensProperty(key))
        case $POINT: return POINT_KEYS.some(key => this.tweensProperty(key))
      }
      return this.tweensProperty(key)
    }

    private tweensProperty(key: string): boolean {
      const endValue = this.value([key, END].join(''))
      if (!isScalar(endValue)) return false

      const startValue = this.value(key)
      if (!isScalar(startValue)) return false

      return startValue !== endValue
    }
  }
}


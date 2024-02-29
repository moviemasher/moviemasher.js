import type { Asset, ClipObject, Constrained, ContainerRectArgs, ContainerSvgItemArgs, ContentInstance, ContentRectArgs, ContentSvgItemArgs, DataOrError, Instance, InstanceObject, IntrinsicOptions, MaybeComplexSvgItem, Point, Points, Rect, RectTuple, Scalar, SideDirectionRecord, Size, SizeKey, Sizes, SvgItemsRecord, SvgVector, Time, TimeRange, Transparency, VisibleAsset, VisibleContentInstance, VisibleInstance, VisibleInstanceObject } from '../types.js'

import { $ASPECT, $AUDIO, $BOOLEAN, $CEIL, $CONTAINER, $CONTENT, $CROP, $END, $FLIP, $HEIGHT, $LOCK, $LONGEST, $LUMINANCE, $MAINTAIN, $NONE, $OPACITY, $PERCENT, $PLAYER, $POINT, $PROBE, $SHORTEST, $SIZE, $STRING, $WIDTH, $X, $Y, ASPECTS, DEFAULT_CONTAINER_ID, DIRECTIONS_SIDE, LOCKS, POINT_KEYS, POINT_ZERO, RGB_WHITE, SIZE_KEYS, SIZE_ZERO, assertTuple, idGenerateString, isDefiniteError, isProbing } from '../runtime.js'
import { isAboveZero, isDefined, isUndefined } from '../utility/guard.js'
import { assertAspect, assertPositive, assertTransparency } from '../utility/guards.js'
import { assertSizeNotZero, containerPoints, containerSizes, contentPoints, contentSizes, sizeNotZero } from '../utility/rect.js'
import { complexifySvgItem, recordFromItems, svgAddClass, svgAppend, svgClipPathElement, svgGroupElement, svgMaskElement, svgOpacity, svgPolygonElement, svgSet } from '../utility/svg.js'


export function VisibleAssetMixin<T extends Constrained<Asset>>(Base: T):
  T & Constrained<VisibleAsset> {
  return class extends Base implements VisibleAsset {
    get alpha(): undefined | boolean {
      const { decodings } = this
      const decoding = decodings.find(decoding => decoding.type === $PROBE)
      if (isProbing(decoding)) {
        const { data } = decoding
        if (data) {
          const { alpha } = data
          return alpha
        }
      }
    }

    canBeFill?: boolean
    
    canBeContainer?: boolean

    canBeContent?: boolean

    override clipObject(object: InstanceObject = {}): ClipObject {
      const clipObject: ClipObject = {}
      const { id, type, canBeContainer, canBeContent } = this
      if (canBeContainer && !canBeContent) {
        clipObject.sizing = $CONTAINER
        clipObject.containerId = id
        clipObject.container = object
      } else {
        clipObject.sizing = $CONTENT
        clipObject.contentId = id
        clipObject.content = object
        if (type !== $AUDIO) clipObject.containerId = DEFAULT_CONTAINER_ID
      }
      return clipObject
    }

    override hasIntrinsicSizing = true

    isVector?: boolean

    get probeSize(): Size | undefined {
      const probing = this.decodingOfType($PROBE)
      if (isProbing(probing)) {
        const { data } = probing
        if (data) {
          const { width, height } = data
          if (isAboveZero(width) && isAboveZero(height)) return { width, height }
        }
      } 
      return undefined
    }
  }
}

export function VisibleInstanceMixin<T extends Constrained<Instance>>(Base: T):
  T & Constrained<VisibleInstance> {
  return class extends Base implements VisibleInstance {
    constructor(...args: any[]) {
      super(...args)
      const [object] = args as [VisibleInstanceObject]

      const { container } = object
      if (container) this.targetId = $CONTAINER

      // this.container = !!container

      const { targetId, asset } = this
      // console.log(this.constructor.name, 'initializeProperties', this.asset.label, { container, targetId })
      if (container) {
        DIRECTIONS_SIDE.forEach(direction => {
          this.properties.push(this.propertyInstance({
            targetId, name: `${direction}${$CROP}`, 
            type: $BOOLEAN, defaultValue: false, 
          }))
        })
      } 
      if (container || !(this.isDefault || asset.type === $AUDIO)) {
        this.properties.push(this.propertyInstance({
          targetId, name: $X, type: $PERCENT, defaultValue: 0.5,
          min: 0.0, max: 1.0, step: 0.01, tweens: true,
        }))
        this.properties.push(this.propertyInstance({
          targetId, name: [$X, $END].join(''), 
          type: $PERCENT, undefinedAllowed: true, tweens: true,
          min: 0.0, max: 1.0, step: 0.01,
        }))
        this.properties.push(this.propertyInstance({
          targetId, name: $Y, type: $PERCENT, defaultValue: 0.5,
          min: 0.0, max: 1.0, step: 0.01, tweens: true,
        }))
        this.properties.push(this.propertyInstance({
          targetId, name: [$Y, $END].join(''), 
          type: $PERCENT, undefinedAllowed: true, tweens: true,
          min: 0.0, max: 1.0, step: 0.01,
        }))
        this.properties.push(this.propertyInstance({
          targetId, name: $LOCK, type: $STRING, 
          defaultValue: $SHORTEST, options: LOCKS, 
        }))
        this.properties.push(this.propertyInstance({
          targetId, name: [$POINT, $ASPECT].join(''), type: $STRING, 
          defaultValue: $MAINTAIN, options: ASPECTS, 
        }))
        this.properties.push(this.propertyInstance({
          targetId, name: [$SIZE, $ASPECT].join(''), type: $STRING, 
          defaultValue: $FLIP, options: ASPECTS, 
        }))
      }

      const hasDimensions = container || this.asset.hasIntrinsicSizing 
      if (hasDimensions) {
        const { properties } = this
        const hasWidth = properties.some(property => property.name.endsWith($WIDTH))
        const hasHeight = properties.some(property => property.name.endsWith($HEIGHT))
        const min = container ? 0 : 1
        const targetId = container ? $CONTAINER : $CONTENT
        if (!hasWidth) {
          this.properties.push(this.propertyInstance({
            targetId, name: $WIDTH, type: $PERCENT,
            defaultValue: 1, min, max: 2, step: 0.01, tweens: true,
          }))
          this.properties.push(this.propertyInstance({
            targetId, name: `${$WIDTH}${$END}`, type: $PERCENT,
            step: 0.01, max: 2, min, undefinedAllowed: true, tweens: true,
          }))
        }
        if (!hasHeight) {
          this.properties.push(this.propertyInstance({
            targetId, name: $HEIGHT, type: $PERCENT,
            defaultValue: 1, max: 2, min, step: 0.01, tweens: true,
          }))
          this.properties.push(this.propertyInstance({
            targetId, name: `${$HEIGHT}${$END}`, type: $PERCENT,
            step: 0.01, max: 2, min, undefinedAllowed: true, tweens: true,
          }))
        }
      }
    }


    declare asset: VisibleAsset

    clippedElement(content: VisibleContentInstance, args: ContainerSvgItemArgs): DataOrError<SvgItemsRecord> {
      // opacity is applied to content during clipping
      const { containerRect, ...rest } = args
      const containerArgs: ContainerSvgItemArgs = { ...rest, containerRect }
      const containerOrError = this.containerSvgItem(containerArgs)
      if (isDefiniteError(containerOrError)) return containerOrError

      const { data: containerItem } = containerOrError
      const { time, size } = args
      const contentRect = content.contentRect(time, containerRect, size)
      const contentArgs: ContentSvgItemArgs = { ...rest, contentRect }
      const contentOrError = content.contentSvgItem(contentArgs)
      if (isDefiniteError(contentOrError)) return contentOrError

      const { data: contentItem } = contentOrError
      return this.containedItem(contentItem, containerItem, args)
    }

    containedItem(contentItem: MaybeComplexSvgItem, containerItem: MaybeComplexSvgItem, args: ContainerSvgItemArgs): DataOrError<SvgItemsRecord> {
      const { panel, containerRect, size } = args
 
      const complexContainer = complexifySvgItem(containerItem) 
      complexContainer.defs ||= []
      const { svgItem: containerSvgItem } = complexContainer

      const complexContent = complexifySvgItem(contentItem) 
      const { svgItem: contentSvgItem } = complexContent

      // combine defs and styles, but don't include items themselves
      const record: SvgItemsRecord = recordFromItems([complexContainer, complexContent], true)
      const { defs, items } = record

      let containerId = idGenerateString()
      const containerIsVector = this.asset.isVector
      if (panel === $PLAYER && !containerIsVector) {
        // container is image/video so we need to add a polygon for hover
        const polygonElement = svgPolygonElement(containerRect, '', 'transparent', containerId)
        svgSet(polygonElement, 'non-scaling-stroke', 'vector-effect')
        defs.push(polygonElement)
        containerId = idGenerateString()
      }
      svgSet(containerSvgItem, containerId)

      const group = svgGroupElement()
      items.push(group)

      svgAddClass(group, 'contained')
      
      // TODO: see if this is really needed, since we added one above
      if (!containerIsVector) svgAppend(group, svgPolygonElement(containerRect, '', 'transparent'))
      svgAppend(group, contentSvgItem)

      const transparency = this.clip.value('transparency')
      assertTransparency(transparency)
      const maskElement = this.maskingElement(group, transparency)
      defs.push(maskElement)

      if (!containerIsVector && transparency === $LUMINANCE) {
        maskElement.appendChild(svgPolygonElement(size, '', 'black'))
      }
      maskElement.appendChild(containerSvgItem)
      if (!containerIsVector) {
        svgSet(containerSvgItem, 'non-scaling-stroke', 'vector-effect')
        svgSet(containerSvgItem, RGB_WHITE, 'fill')
      }
      return { data: record }
    }

    containerSvgItem(args: ContainerSvgItemArgs): DataOrError<MaybeComplexSvgItem> {
      const { containerRect, color, opacity } = args
      const data = this.svgVector(containerRect, color, opacity)
      return { data }
    }

    contentSvgItem(args: ContentSvgItemArgs): DataOrError<MaybeComplexSvgItem> {
      const { contentRect, opacity } = args
      return { data: this.svgVector(contentRect, '', opacity) }
    }

    // container = false

    containerRects(args: ContainerRectArgs, size: Size): RectTuple {
      const { outputSize, time, timeRange } = args
      const inSize = sizeNotZero(size) ? size : this.intrinsicRect
      assertSizeNotZero(outputSize, 'outputSize')
      const pointAspect = this.value([$POINT, $ASPECT].join('')) 
      assertAspect(pointAspect)
  
      const sizeAspect = this.value([$SIZE, $ASPECT].join(''))
      assertAspect(sizeAspect)
  
      const { sizeKey, cropDirections } = this
      const containerTweenRects = this.scaleRects(time, timeRange)
      // containerTweenRects.forEach(rect => {
      //   assertSize(rect, 'containerTweenRects')
      // })
      const sizes = containerSizes(containerTweenRects, inSize, outputSize, sizeAspect, $CEIL, sizeKey)
      sizes.forEach(size => assertSizeNotZero(size, 'containerRects size'))
      
      const points = containerPoints(containerTweenRects, sizes, outputSize, pointAspect, cropDirections, $CEIL)
      const rects = sizes.map((size, index) => ({ ...size, ...points[index] }))
      assertTuple<Rect>(rects)
      return rects
    }
    
    contentRects(args: ContentRectArgs): RectTuple {
      const { containerRects, time, timeRange, outputSize } = args    
      const { intrinsicRect, sizeKey } = this
      // if I have no intrinsic size (like color source), use the container rects
      if (!sizeNotZero(intrinsicRect)) return containerRects
  
      const pointAspect = this.value([$POINT, $ASPECT].join('')) 
      assertAspect(pointAspect)
      const sizeAspect = this.value([$SIZE, $ASPECT].join(''))
      assertAspect(sizeAspect)
  
  
      const tweenRects = this.scaleRects(time, timeRange)
      const points = contentPoints(tweenRects, intrinsicRect, containerRects, outputSize, sizeAspect, pointAspect, $CEIL, sizeKey)
      const sizes = contentSizes(tweenRects, intrinsicRect, containerRects, outputSize, sizeAspect, $CEIL, sizeKey)
      const rects = sizes.map((size, index) => ({ ...size, ...points[index] }))
      assertTuple<Rect>(rects)
      return rects
    }
    


    get intrinsicRect(): Rect {
      const { probeSize = SIZE_ZERO } = this.asset
      return { ...POINT_ZERO, ...probeSize }
    }

    override intrinsicsKnown(options: IntrinsicOptions): boolean {
      if (options.size) return sizeNotZero(this.asset.probeSize)

      return super.intrinsicsKnown(options)
    }

    contentRect(time: Time, containerRect: Rect, outputSize: Size): Rect {
      const contentRectArgs: ContentRectArgs = {
        containerRects: [containerRect, containerRect], 
        outputSize, time, timeRange: this.clip.timeRange
      }
      const [contentRect] = this.contentRects(contentRectArgs)
      return contentRect
    }

    private maskingElement(group: SVGGElement, transparency: Transparency): SVGClipPathElement | SVGMaskElement {
      if (this.asset.isVector) return svgClipPathElement(group)

      return svgMaskElement(group, transparency)
    }

    scaleRects(time: Time, range: TimeRange): RectTuple {
      const [size, sizeEnd] = this.tweenSizes(time, range)
      const [point, pointEnd] = this.tweenPoints(time, range)
      const rect = { ...point , ...size }
      const rects: RectTuple = [ rect, rect ]
      if (isDefined(sizeEnd) || isDefined(pointEnd)) {
        rects[1] = { ...(pointEnd || point), ...(sizeEnd || size) }
      }
      return rects 
    }
    get sizeKey(): SizeKey | undefined {
      const lock = this.value($LOCK)
      switch (lock) {
        case $NONE: return
        case $WIDTH: 
        case $HEIGHT: return lock
      }
      const size = this.intrinsicRect
      const portrait = size.width < size.height
      
      switch (lock) {
        case $SHORTEST: return portrait ? $WIDTH : $HEIGHT
        case $LONGEST: return portrait ? $HEIGHT : $WIDTH
      }
    }
  
    get cropDirections(): SideDirectionRecord {
      return Object.fromEntries(DIRECTIONS_SIDE.map(direction => {
        const key = `${direction}${$CROP}`
        const value = this.value(key)
        return [direction, Boolean(value)]
      })) 
    }

    svgVector(rect: Rect, forecolor?: string, opacity?: Scalar): SvgVector {
      // console.log(this.constructor.name, 'svgVector', rect, forecolor, opacity)
      return svgOpacity(svgPolygonElement(rect, '', forecolor), opacity)
    }
    private tweenPoints(time: Time, range: TimeRange): Points {
      const [xStart, xEndOrNot] = this.tweenValues($X, time, range)
      const [yStart, yEndOrNot] = this.tweenValues($Y, time, range)
      assertPositive(xStart, 'xStart')
      assertPositive(yStart, 'yStart')
      const point: Point = { x: xStart, y: yStart } 
      const points: Points = [point]
      if (isDefined(xEndOrNot) || isDefined(yEndOrNot)) {
        const x = isDefined(xEndOrNot) ? xEndOrNot : xStart
        const y = isDefined(yEndOrNot) ? yEndOrNot : yStart
        // console.log('InstanceClass.tweenPoints', { x, y }, time, range)
        assertPositive(x, 'x')
        assertPositive(y, 'y')
  
        points.push({ x, y }) 
      }
      return points
    }
  
    private tweenSizes(time: Time, range: TimeRange): Sizes {
      const [widthStart, widthEndOrNot] = this.tweenValues($WIDTH, time, range)
      const [heightStart, heightEndOrNot] = this.tweenValues($HEIGHT, time, range)
  
      assertPositive(widthStart)
      assertPositive(heightStart)
      const size: Size = { width: widthStart, height: heightStart } 
      const sizes: Sizes = [size]
      if (isDefined(widthEndOrNot) || isDefined(heightEndOrNot)) {
        const width = isDefined(widthEndOrNot) ? widthEndOrNot : widthStart
        const height = isDefined(heightEndOrNot) ? heightEndOrNot : heightStart
        assertPositive(width)
        assertPositive(height)
        
        sizes.push({ width, height })
      }
      return sizes
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
      const endValue = this.value([key, $END].join(''))
      if (isUndefined(endValue)) return false

      const startValue = this.value(key)
      if (isUndefined(startValue)) return false

      return startValue !== endValue
    }
  }
}


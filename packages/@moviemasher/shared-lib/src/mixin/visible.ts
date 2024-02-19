import type { Asset, ClipObject, Constrained, ContainerSvgItemArgs, ContentInstance, ContentRectArgs, ContentSvgItemArgs, DataOrError, Instance, InstanceObject, IntrinsicOptions, MaybeComplexSvgItem, Rect, Scalar, Size, SvgItemsRecord, SvgVector, Time, Transparency, VisibleAsset, VisibleInstance, VisibleInstanceObject } from '../types.js'

import { $OPACITY, $POINT, $SIZE, $AUDIO, $CONTAINER, $CONTENT, DEFAULT_CONTAINER_ID, $END, $HEIGHT, $LUMINANCE, $PERCENT, $PLAYER, POINT_KEYS, POINT_ZERO, $PROBE, RGB_WHITE, SIZE_KEYS, SIZE_ZERO, $WIDTH, idGenerateString, isDefiniteError, isProbing } from '../runtime.js'
import { isAboveZero } from '../utility/guard.js'
import { isUndefined } from '../utility/guard.js'
import { sizeNotZero } from '../utility/rect.js'
import { complexifySvgItem, recordFromItems, svgAddClass, svgAppend, svgClipPathElement, svgGroupElement, svgMaskElement, svgOpacity, svgPolygonElement, svgSet } from '../utility/svg.js'


export function VisibleAssetMixin<T extends Constrained<Asset>>(Base: T):
  T & Constrained<VisibleAsset> {
  return class extends Base implements VisibleAsset {
    alpha?: boolean

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

    container?: boolean

    content?: boolean

    hasIntrinsicSizing?: boolean

    isVector?: boolean

    get probeSize(): Size | undefined {
      const probing = this.decodingOfType($PROBE)
      if (isProbing(probing)) {
        const { data } = probing
        if (data) {
          const { width, height } = data
          if (isAboveZero(width) && isAboveZero(height)) return { width, height }
        }
      } else {
        console.warn(this.constructor.name, 'probeSize not probing', probing)
      }
      return undefined
    }
  }
}


export function VisibleInstanceMixin<T extends Constrained<Instance>>(Base: T):
  T & Constrained<VisibleInstance> {
  return class extends Base implements VisibleInstance {
    declare asset: VisibleAsset

    clippedElement(content: ContentInstance, args: ContainerSvgItemArgs): DataOrError<SvgItemsRecord> {
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

      const { transparency } = this.clip
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

    override initializeProperties(object: VisibleInstanceObject): void {
      const { container } = this
      const hasDimensions = container || this.asset.hasIntrinsicSizing //!this.isDefault
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
      super.initializeProperties(object)
    }

    override get intrinsicRect(): Rect {
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

    svgVector(rect: Rect, forecolor?: string, opacity?: Scalar): SvgVector {
      // console.log(this.constructor.name, 'svgVector', rect, forecolor, opacity)
      return svgOpacity(svgPolygonElement(rect, '', forecolor), opacity)
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


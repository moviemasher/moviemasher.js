import type { Constrained, DataOrError, IntrinsicOptions, PropertySize, Rect, Size, SvgItem, SvgItems, Time, Transparency, VisibleAsset, VisibleInstance } from '@moviemasher/shared-lib/types.js'
import type { ClientAsset, ClientInstance, ClientVisibleAsset, ClientVisibleInstance, Panel } from '../types.js'

import { ERROR, HEIGHT, LUMINANCE, POINT_ZERO, RGB_WHITE, WIDTH, errorThrow, idGenerateString, isDefiniteError } from '@moviemasher/shared-lib/runtime.js'
import { assertSizeAboveZero, sizeAboveZero } from '@moviemasher/shared-lib/utility/rect.js'
import { svgAddClass, svgAppend, svgClipPathElement, svgDefsElement, svgGroupElement, svgMaskElement, svgPolygonElement, svgSetChildren, svgSetDimensions, svgSvgElement } from '@moviemasher/shared-lib/utility/svg.js'
import { assertClientVisibleInstance } from '../guards/ClientGuards.js'
import { TIMELINE } from '../runtime.js'

export function ClientVisibleAssetMixin
<T extends Constrained<ClientAsset & VisibleAsset>>(Base: T):
T & Constrained<ClientVisibleAsset>  {
  return class extends Base implements ClientVisibleAsset {
    
  }
}

export function ClientVisibleInstanceMixin<T extends Constrained<ClientInstance & VisibleInstance>>(Base: T):
  T & Constrained<ClientVisibleInstance> {
  return class extends Base implements ClientVisibleInstance {
    declare asset: ClientVisibleAsset

    // private maskingElement(group: SVGGElement, transparency: Transparency): SVGClipPathElement | SVGMaskElement {
    //   if (this.asset.isVector) return svgClipPathElement(group)
    //   return svgMaskElement(group, transparency)   
    // }
    clippedElementPromise(content: ClientVisibleInstance, containerRect: Rect, outputSize: Size, time: Time, component: Panel): Promise<DataOrError<Element>> {
      // console.log(this.constructor.name, 'clippedElementPromise')
      const shortest = outputSize.width < outputSize.height ? WIDTH : HEIGHT
      return content.contentSvgItemPromise(containerRect, shortest, time, component).then(orError => {
        if (isDefiniteError(orError)) return orError

        return this.containedPreviewPromise(orError.data, content, containerRect, outputSize, time, component).then(containedOrError => {
          if (isDefiniteError(containedOrError)) return containedOrError

          const { data: svgVector} = containedOrError
          const svgFilter = this.containerOpacityFilter(svgVector, outputSize, containerRect, time, this.clip.timeRange)
          if (svgFilter) svgVector.setAttribute('filter', `url(#${svgFilter.id})`)
          else svgVector.removeAttribute('filter')

          return { data: svgVector }
        })
      })
    }

    private maskingElement(group: SVGGElement, transparency: Transparency): SVGClipPathElement | SVGMaskElement {
      if (this.asset.isVector) return svgClipPathElement(group)

      return svgMaskElement(group, transparency)
    }
    
    private containedPreviewPromise(contentItem: SvgItem, content: ClientInstance, containerRect: Rect, size: Size, time: Time, component: Panel): Promise<DataOrError<SvgItem>> {
      const { timeRange: range, transparency } = this.clip

      const containerPromise = this.containerSvgItemPromise(containerRect, time, component)
      return containerPromise.then(orError => {
        if (isDefiniteError(orError)) return orError

        const { data: containerItem } = orError

        const defs: SvgItems = []

        let containerId = idGenerateString()
        const containerIsVector = this.asset.isVector
        if (component !== TIMELINE && !containerIsVector) {
          // container is image/video so we need to add a polygon for hover
          const polygonElement = svgPolygonElement(containerRect, '', 'transparent', containerId)
          polygonElement.setAttribute('vector-effect', 'non-scaling-stroke')
          defs.push(polygonElement)
          containerId = idGenerateString()
        }
        containerItem.setAttribute('id', containerId)

        const group = svgGroupElement()

        if (!containerIsVector) svgAppend(group, svgPolygonElement(containerRect, '', 'transparent'))
        svgAppend(group, contentItem)

        svgAddClass(group, 'contained')
        const maskElement = this.maskingElement(group, transparency)
        defs.push(maskElement)

        if (!containerIsVector && transparency === LUMINANCE) maskElement.appendChild(svgPolygonElement(size, '', 'black'))
        maskElement.appendChild(containerItem)
        if (!containerIsVector) {
          containerItem.setAttribute('vector-effect', 'non-scaling-stroke')
          containerItem.setAttribute('fill', RGB_WHITE)
        }
        assertClientVisibleInstance(content)

        const contentFilter = this.containerOpacityFilter(contentItem, size, containerRect, time, range)
        if (contentFilter) defs.push(contentFilter)
        else contentItem.removeAttribute('filter')
      
        const contentIsVector = content.asset.isVector
        const useSvg = (!contentIsVector || !containerIsVector) && component !== TIMELINE
        const svg = useSvg ? this.svgElement : svgSvgElement()
        svgSetChildren(svg, [svgDefsElement(defs), group])
        svgSetDimensions(svg, size)
        return { data: svg }
      })
    }

    containerSvgItemPromise(rect: Rect, time: Time, component: Panel): Promise<DataOrError<SvgItem>> {
      // console.log(this.constructor.name, 'containerSvgItemPromise')
      if (component === TIMELINE) return this.svgItemForTimelinePromise(rect, time)

      return this.svgItemForPlayerPromise(rect, time).then(orError => {
        if (!isDefiniteError(orError)) svgSetDimensions(orError.data, rect)
        return orError
      })
    }

    contentSvgItemPromise(containerRect: Rect, shortest: PropertySize, time: Time, component: Panel): Promise<DataOrError<SvgItem>> {
      const rect = this.itemContentRect(containerRect, shortest, time)
      return this.containerSvgItemPromise(rect, time, component)
    }

    override get intrinsicRect(): Rect {
      const { probeSize } = this.asset
      assertSizeAboveZero(probeSize)
      
      return { ...POINT_ZERO, ...probeSize }
    }

    override intrinsicsKnown(options: IntrinsicOptions): boolean {
      if (!options.size) return true

      return sizeAboveZero(this.asset.probeSize)
    }

    private _svgElement?: SVGSVGElement

    private get svgElement() {
      // console.debug(this.constructor.name, 'svgElement USED!')
      return this._svgElement ||= svgSvgElement()
    }

    svgItemForPlayerPromise(rect: Rect, time: Time): Promise<DataOrError<SvgItem>> {
      return this.svgItemForTimelinePromise(rect, time)
    }

    svgItemForTimelinePromise(_rect: Rect, _time: Time): Promise<DataOrError<SvgItem>> {
      return errorThrow(ERROR.Unimplemented)
    }

    
  }
}

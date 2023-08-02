import type { Preview, SvgItem, SvgItems } from '@moviemasher/runtime-client'
import type { Constrained, ContainerInstance, PropertySize, Rect, Size, Time, TimeRange, VisibleInstance } from '@moviemasher/runtime-shared'
import type { Panel } from "@moviemasher/runtime-client"


import { ErrorName, errorThrow } from '@moviemasher/runtime-shared'
import { PanelPlayer } from "../PanelConstants.js"
import { colorWhite } from '../../Helpers/Color/ColorConstants.js'
import { NamespaceSvg } from "../../Setup/Constants.js"
import { assertNumber, isBelowOne } from '../../Shared/SharedGuards.js'
import { idGenerateString } from '../../Utility/IdFunctions.js'
import { ClientVisibleAsset } from '@moviemasher/runtime-client'
import { assertClientVisibleInstance } from '../ClientGuards.js'
import { ClientInstance, ClientVisibleInstance } from '@moviemasher/runtime-client'
import { svgAddClass, svgAppend, svgClipPathElement, svgDefsElement, svgFilterElement, svgGroupElement, svgMaskElement, svgPolygonElement, svgSet, svgSetChildren, svgSetDimensions, svgSvgElement, svgUseElement } from '../SvgFunctions.js'


export function ClientVisibleInstanceMixin<T extends Constrained<ClientInstance & VisibleInstance>>(Base: T):
  T & Constrained<ClientVisibleInstance> {
  return class extends Base implements ClientVisibleInstance {
    declare asset: ClientVisibleAsset
    
    private clipperElement(group: SVGGElement, luminance?: boolean): SVGClipPathElement | SVGMaskElement {
      if (this.asset.isVector) {
        return svgClipPathElement(undefined, group)
        
      }
      return svgMaskElement(undefined, group, luminance)   
    }

    containedPreviewPromise(contentItem: SvgItem, content: ClientInstance, containerRect: Rect, size: Size, time: Time, component: Panel): Promise<Preview> {
      const range = this.clip.timeRange
      const containerPromise = this.containerSvgItemPromise(containerRect, time, component)
      return containerPromise.then(containerItem => {
        const defs: SvgItems = []
        // TODO: make luminance a property of container...
        const luminance = true
        const updatableContent = !content.asset.isVector
        const { isVector } = this.asset

        // defs.push(containerItem)
        let containerId = idGenerateString()
        if (component === PanelPlayer && !isVector) {
          // container is image/video so we need to add a polygon for hover
          const polygonElement = svgPolygonElement(containerRect, '', 'transparent', containerId)
          polygonElement.setAttribute('vector-effect', 'non-scaling-stroke')
          defs.push(polygonElement)
          containerId = idGenerateString()
        }
        containerItem.setAttribute('id', containerId)

        const group = svgGroupElement()
        if (!isVector) svgAppend(group, svgPolygonElement(containerRect, '', 'transparent'))
        svgAppend(group, contentItem)
        
        const items: SvgItems = [group]
        svgAddClass(group, 'contained')
        const maskElement = this.clipperElement(group, luminance)
        defs.push(maskElement)

        // const useContainerInMask = svgUseElement(containerId)
        // console.log(this.constructor.name, 'containedPreviewPromise', content.assetId, containerId, useContainerInMask)
        if (!isVector) maskElement.appendChild(svgPolygonElement(size, '', 'black'))
        maskElement.appendChild(containerItem)
        if (!isVector) {
          containerItem.setAttribute('vector-effect', 'non-scaling-stroke')
          containerItem.setAttribute('fill', colorWhite)
        }
        const svgFilter = this.containerSvgFilter(containerItem, size, containerRect, time, range)
        if (svgFilter) defs.push(svgFilter)
        else containerItem.removeAttribute('filter')
        
        assertClientVisibleInstance(content)

        const contentSvgFilter = content.contentSvgFilter(this, contentItem, size, containerRect, time, range)
        if (contentSvgFilter) defs.push(contentSvgFilter)
        else contentItem.removeAttribute('filter')

        const useSvg = (updatableContent || !isVector) && component === PanelPlayer
        const svg = useSvg ? this.svgElement : svgSvgElement()
        svgSetChildren(svg, [svgDefsElement(defs), ...items])
        svgSetDimensions(svg, size)

        return svg
      })
    }
  
    clippedPreviewPromise(content: ClientVisibleInstance, containerRect: Rect, previewSize: Size, time: Time, component: Panel): Promise<Preview> {
      const shortest = previewSize.width < previewSize.height ? 'width' : 'height'
      return content.contentPreviewItemPromise(containerRect, shortest, time, component).then(contentSvgItem => (
        this.containedPreviewPromise(contentSvgItem, content, containerRect, previewSize, time, component)
      ))
    }

    private containerSvgFilter(svgItem: SvgItem, outputSize: Size, containerRect: Rect, time: Time, clipTime: TimeRange): SVGFilterElement | undefined {
      
      return undefined
    } 
    
    containerSvgItemPromise(rect: Rect, time: Time, component: Panel): Promise<SvgItem> {
      if (component !== PanelPlayer)
        return this.svgItemForTimelinePromise(rect, time)

      return this.svgItemForPlayerPromise(rect, time).then(svgItem => {
        svgSetDimensions(svgItem, rect)
        return svgItem
      })
    }

    contentPreviewItemPromise(containerRect: Rect, shortest: PropertySize, time: Time, component: Panel): Promise<SvgItem> {
      // console.log(this.constructor.name, 'contentPreviewItemPromise', containerRect)
      
      const rect = this.itemContentRect(containerRect, shortest, time)
      return this.containerSvgItemPromise(rect, time, component)
    }

    contentSvgFilter(container: ContainerInstance, svgItem: SvgItem, outputSize: Size, containerRect: Rect, time: Time, clipTime: TimeRange): SVGFilterElement | undefined {
      
      const [opacity] = container.tweenValues('opacity', time, clipTime)
      if (!isBelowOne(opacity)) return
      
      assertNumber(opacity)

      const { document } = globalThis
      const filterElement = document.createElementNS(NamespaceSvg, 'feColorMatrix')
      filterElement.setAttribute('type', 'matrix')
      const values = `1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${opacity} 0`

      svgSet(filterElement, values, 'values')
      return svgFilterElement([filterElement], svgItem)
      // const { isDefaultOrAudio } = this
      // if (isDefaultOrAudio || !effects.length) return
  
      // const range = this.clip.timeRange
      // const filters: SvgFilters = this.effects.flatMap(effect => 
      //   effect.svgFilters(outputSize, containerRect, time, range)
      // )
  
      // const filter = svgFilterElement(filters, contentItem)
      // svgSet(filter, '200%', 'width')
      // svgSet(filter, '200%', 'height')
  
      // return filter
    }

    pathElement(rect: Rect, forecolor = 'none'): SvgItem {
      return svgPolygonElement(rect, '', forecolor)
    }
  
    private _svgElement?: SVGSVGElement
    
    private get svgElement() {
      return this._svgElement ||= svgSvgElement()
    }

    svgItemForPlayerPromise(rect: Rect, time: Time): Promise<SvgItem> {
      return this.svgItemForTimelinePromise(rect, time)
    }

    svgItemForTimelinePromise(rect: Rect, time: Time): Promise<SvgItem> {
      return errorThrow(ErrorName.Unimplemented)
    }
  }
}

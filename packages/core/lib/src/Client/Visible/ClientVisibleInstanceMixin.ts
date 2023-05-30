import type { Component } from '../../Base/Code.js'
import type { Rect, Size } from '@moviemasher/runtime-shared'
import type { PreviewItem, PreviewItems, SvgFilters, SvgItem, SvgItems } from '../../Helpers/Svg/Svg.js'
import type { Time, TimeRange } from '@moviemasher/runtime-shared'
import { ComponentPlayer } from '../../Base/Code.js'
import { ErrorName } from '../../Helpers/Error/ErrorName.js'
import { errorThrow } from '../../Helpers/Error/ErrorFunctions.js'
import { svgAddClass, svgAppend, svgDefsElement, svgFilterElement, svgGroupElement, svgMaskElement, svgPolygonElement, svgSet, svgSetChildren, svgSetDimensions, svgSvgElement, svgUseElement } from '../../Helpers/Svg/SvgFunctions.js'
import { Constrained } from '../../Base/Constrained.js'
import { ClientInstance, ClientVisibleInstance } from '../ClientTypes.js'
import { ClientVisibleAsset } from '../Asset/ClientAsset.js'
import { idGenerateString } from '../../Utility/Id.js'
import { colorWhite } from '../../Helpers/Color/ColorConstants.js'
import { assertClientVisibleInstance } from '../ClientGuards.js'
import { assertObject, isBelowOne } from '../../Shared/SharedGuards.js'
import { ClientEffect } from '../../index.js'
import { VisibleInstance } from '../../Shared/Instance/Instance.js'


export function ClientVisibleInstanceMixin<T extends Constrained<ClientInstance & VisibleInstance>>(Base: T):
  T & Constrained<ClientVisibleInstance> {
  return class extends Base implements ClientVisibleInstance {
    declare asset: ClientVisibleAsset
    
    containedPromise(contentItem: SvgItem, content: ClientInstance, containerRect: Rect, size: Size, time: Time, component: Component): Promise<PreviewItem> {
      const range = this.clip.timeRange
      const containerPromise = this.containerSvgItemPromise(containerRect, time, component)
      const updatableContainer = !this.asset.isVector
      return containerPromise.then(containerItem => {
        const defs: SvgItems = []
        // TODO: make luminance a property of container...
        const luminance = true
        const updatableContent = !content.asset.isVector

        defs.push(containerItem)
        let containerId = idGenerateString()
        if (updatableContainer && component === ComponentPlayer) {
          // container is image/video so we need to add a polygon for hover
          const polygonElement = svgPolygonElement(containerRect, '', 'transparent', containerId)
          polygonElement.setAttribute('vector-effect', 'non-scaling-stroke')
          defs.push(polygonElement)
          containerId = idGenerateString()
        }
        containerItem.setAttribute('id', containerId)

        const group = svgGroupElement()
        svgAppend(group, [svgPolygonElement(containerRect, '', 'transparent'), contentItem])
        const items: SvgItems = [group]

        svgAddClass(group, 'contained')
        const maskElement = svgMaskElement(undefined, group, luminance)
        defs.push(maskElement)

        const useContainerInMask = svgUseElement(containerId)

        maskElement.appendChild(svgPolygonElement(size, '', 'black'))
        maskElement.appendChild(useContainerInMask)
        if (!updatableContainer) {
          containerItem.setAttribute('vector-effect', 'non-scaling-stroke')
          useContainerInMask.setAttribute('fill', colorWhite)
        }
        const svgFilter = this.containerSvgFilter(containerItem, size, containerRect, time, range)
        if (svgFilter)
          defs.push(svgFilter)
        else
          containerItem.removeAttribute('filter')
        
          assertClientVisibleInstance(content)

        const contentSvgFilter = content.contentSvgFilter(contentItem, size, containerRect, time)
        if (contentSvgFilter)
          defs.push(contentSvgFilter)
        else
          contentItem.removeAttribute('filter')

        const useSvg = (updatableContent || updatableContainer) && component === ComponentPlayer
        const svg = useSvg ? this.svgElement : svgSvgElement()
        svgSetChildren(svg, [svgDefsElement(defs), ...items])
        svgSetDimensions(svg, size)

        return svg
      })
    }
  
    clippedPreviewItemPromise(content: ClientVisibleInstance, containerRect: Rect, size: Size, time: Time, component: Component): Promise<PreviewItem> {
      return content.contentPreviewItemPromise(containerRect, time, component).then(contentSvgItem => (
        this.containedPromise(contentSvgItem, content, containerRect, size, time, component)
      ))
    }

    private containerSvgFilter(svgItem: SvgItem, outputSize: Size, containerRect: Rect, time: Time, clipTime: TimeRange): SVGFilterElement | undefined {
      const [opacity] = this.tweenValues('opacity', time, clipTime)
      // console.log(this.constructor.name, 'containerSvgFilters', opacity)
      if (!isBelowOne(opacity))
        return
  
      const { opacityFilter } = this
      opacityFilter.setValue(opacity, 'opacity')
      return svgFilterElement(opacityFilter.filterSvgFilter(), svgItem)
    } 
    
    
    containerSvgItemPromise(rect: Rect, time: Time, component: Component): Promise<SvgItem> {
      if (component !== ComponentPlayer)
        return this.svgItemForTimelinePromise(rect, time)

      return this.svgItemForPlayerPromise(rect, time).then(svgItem => {
        svgSetDimensions(svgItem, rect)
        return svgItem
      })
    }



    contentPreviewItemPromise(containerRect: Rect, time: Time, component: Component): Promise<SvgItem> {
      const rect = this.itemContentRect(containerRect, time)
      return this.containerSvgItemPromise(rect, time, component)
    }

    contentSvgFilter(contentItem: SvgItem, outputSize: Size, containerRect: Rect, time: Time): SVGFilterElement | undefined {
      const { effects, isDefaultOrAudio } = this
      if (isDefaultOrAudio || !effects.length) return
  
      const range = this.clip.timeRange
      const filters: SvgFilters = this.effects.flatMap(effect => 
        effect.svgFilters(outputSize, containerRect, time, range)
      )
  
      const filter = svgFilterElement(filters, contentItem)
      svgSet(filter, '200%', 'width')
      svgSet(filter, '200%', 'height')
  
      return filter
    }
  
    declare effects: ClientEffect[]

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

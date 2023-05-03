import type {ClientVideo} from '../../Helpers/ClientMedia/ClientMedia.js'
import type {Component, CommandFilterArgs, CommandFilters, FilterCommandFilterArgs, VisibleCommandFilterArgs} from '../../Base/Code.js'
import type {Container, ContainerClass, ContainerDefinition, ContainerRectArgs} from './Container.js'
import type {Content} from '../Content/Content.js'
import type {Filter} from '../../Plugin/Filter/Filter.js'
import type {PreviewItems, SvgItem, SvgItems} from '../../Helpers/Svg/Svg.js'
import type {Rect, RectTuple} from '../../Utility/Rect.js'
import type {Size} from '../../Utility/Size.js'
import type {Time, TimeRange} from '../../Helpers/Time/Time.js'
import type {TweenableClass} from '../../Mixin/Tweenable/Tweenable.js'
import type {Tweening} from '../../Mixin/Tweenable/Tween.js'

import { ComponentPlayer, } from '../../Base/Code.js'
import { rectsEqual} from '../../Utility/Rect.js'
import { sizeCopy} from '../../Utility/Size.js'
import { tweenMaxSize, tweenOverRect, tweenRectsLock, tweenScaleSizeRatioLock, tweenScaleSizeToRect} from '../../Mixin/Tweenable/Tween.js'
import {Directions, SideDirectionObject, TypeVideo, TypeImage, TypeSequence, DataTypeBoolean, DataTypePercent, SideDirections} from '../../Setup/Enums.js'
import {arrayLast} from '../../Utility/Array.js'
import {assertClientImage, isClientVideo} from '../../Helpers/ClientMedia/ClientMediaFunctions.js'
import {assertObject, assertPopulatedArray, assertPopulatedString, assertTimeRange, assertTrue, isBelowOne, isDefined, isDefiniteError, isTimeRange} from '../../Utility/Is.js'
import {assertVideoMedia} from '../Video/Video.js'
import {colorWhite} from '../../Helpers/Color/ColorConstants.js'
import {DataGroupOpacity, DataGroupPoint, propertyInstance} from '../../Setup/Property.js'
import {DefaultContainerId} from './ContainerConstants.js'
import {errorThrow} from '../../Helpers/Error/ErrorFunctions.js'
import {filterFromId} from '../../Plugin/Filter/FilterFactory.js'
import {idGenerateString} from '../../Utility/Id.js'
import {NamespaceSvg, SemicolonChar} from '../../Setup/Constants.js'
import {pointCopy} from '../../Utility/Point.js'
import {PropertyTweenSuffix} from '../../Base/Propertied.js'
import {requestImagePromise} from '../../Helpers/Request/RequestFunctions.js'
import {svgAddClass, svgAppend, svgDefsElement, svgSvgElement, svgFilterElement, svgGroupElement, svgMaskElement, svgPolygonElement, svgSet, svgSetChildren, svgSetDimensions, svgUrl, svgUseElement} from '../../Helpers/Svg/SvgFunctions.js'
import { TranscodingTypes } from '../../Plugin/Transcode/Transcoding/Transcoding.js'


export function ContainerMixin<T extends TweenableClass>(Base: T): ContainerClass & T {
  return class extends Base implements Container {
    constructor(...args: any[]) {
      super(...args)
      const [object] = args
      
      const { container } = this
      if (container) {
        this.addProperties(object, propertyInstance({
          name: 'x', type: DataTypePercent, defaultValue: 0.5,
          group: DataGroupPoint, tweenable: true, 
        }))
        this.addProperties(object, propertyInstance({
          name: 'y', type: DataTypePercent, defaultValue: 0.5,
          group: DataGroupPoint, tweenable: true, 
        }))
        // offN, offS, offE, offW
        SideDirections.forEach(direction => {
          this.addProperties(object, propertyInstance({
            name: `off${direction}`, type: DataTypeBoolean, 
            group: DataGroupPoint,
          }))
        })
        
        this.addProperties(object, propertyInstance({
          tweenable: true, name: 'opacity', 
          type: DataTypePercent, defaultValue: 1.0,
          group: DataGroupOpacity,
        }))        
      }
    }

    private _colorizeFilter?: Filter
    get colorizeFilter() { return this._colorizeFilter ||= filterFromId('colorize')}

    colorizeCommandFilters(args: CommandFilterArgs): CommandFilters {
      const { contentColors: colors, videoRate, filterInput, time } = args
      assertPopulatedArray(colors)
      const duration = isTimeRange(time) ? time.lengthSeconds : 0

      const { colorizeFilter } = this
      const filterArgs: FilterCommandFilterArgs = {
        videoRate, duration, filterInput
      }
      const [color, colorEnd] = colors
      colorizeFilter.setValue(color, 'color')
      colorizeFilter.setValue(colorEnd, `color${PropertyTweenSuffix}`)
      
      return colorizeFilter.commandFilters(filterArgs)
    }

    colorMaximize = false
    
    private stylesSrcPromise(zeroRect: Rect, definitionTime: Time): Promise<string> {
      const { type, definition } = this
      const types: TranscodingTypes = []
      if (type === TypeImage) types.push(type)
      else types.push(TypeSequence, TypeVideo)
      const transcoding = definition.preferredTranscoding(...types)
      const { type: transcodingType } = transcoding
      if (transcodingType === TypeSequence) {
        assertVideoMedia(definition)
        return definition.loadedImagePromise(definitionTime, sizeCopy(zeroRect)).then(image => (
          image.src
        ))
      }
      const imageTranscoding = definition.preferredTranscoding(TypeImage)
      const { request } = imageTranscoding

      return this.definition.requestImagePromise(request).then(orError => {
        if (isDefiniteError(orError)) return errorThrow(orError.error)

        const { data: clientImage } = orError
       

        assertClientImage(clientImage)
        return clientImage.src
      }) 
    }

    private stylesPromise(zeroRect: Rect, definitionTime: Time): Promise<string[]> {
      return this.stylesSrcPromise(zeroRect, definitionTime).then(src => {
        const styles: string[] = []
        styles.push(`mask-image: url(${src})`)
        styles.push('mask-repeat: no-repeat')
        styles.push('mask-mode: luminance')
        styles.push(`mask-size: ${zeroRect.width}px ${zeroRect.height}px`)
        styles.push(`mask-position: ${zeroRect.x}px ${zeroRect.y}px`)
        return styles
      })
    }

    private containedVideo(video: ClientVideo, containerRect: Rect, size: Size, time: Time, range: TimeRange): Promise<PreviewItems> {
      const x = Math.round(Number(video.getAttribute('x')))
      const y = Math.round(Number(video.getAttribute('y')))
      const containerPoint = pointCopy(containerRect)
      containerPoint.x -= x
      containerPoint.y -= y
      
      const zeroRect = { ...containerPoint, ...sizeCopy(containerRect)}
      const updatableContainer = !this.definition.isVector 
      const promise: Promise<string[]> = updatableContainer ? this.stylesPromise(zeroRect, this.definitionTime(time, range)) : Promise.resolve([])
      
      return promise.then(styles => {
        const items: PreviewItems = []
        const { div } = this

        styles.push(`left: ${x}px`)
        styles.push(`top: ${y}px`)
        if (!updatableContainer) {
          const containerItem = this.pathElement(zeroRect)
          containerItem.setAttribute('fill', colorWhite)
          const clipId = idGenerateString() 
          const clipElement = globalThis.document.createElementNS(NamespaceSvg, 'clipPath')
          svgSet(clipElement, clipId)
          svgAppend(clipElement, containerItem)
          
          const svg = svgSvgElement(size)
          svgSetChildren(svg, [svgDefsElement([clipElement])])
          
          styles.push(`clip-path:${svgUrl(clipId)}`)
          items.push(svg)
        }
        div.setAttribute('style', styles.join(SemicolonChar) + SemicolonChar)
        svgSetChildren(div, [video])
          
        items.push(div)
        return items
      })
    }

    previewItemsPromise(content: Content, containerRect: Rect, size: Size, time: Time, range: TimeRange, component: Component): Promise<PreviewItems> {
      const contentPromise = content.contentPreviewItemPromise(containerRect, time, range, component)
      const containedPromise = contentPromise.then(contentItem => {
        assertObject(contentItem, 'contentItem')
        
        if (isClientVideo(contentItem)) {
          assertTrue(component === ComponentPlayer, 'video in player')
          return this.containedVideo(contentItem, containerRect, size, time, range)
        }   

        const containerPromise = this.containerSvgItemPromise(containerRect, time, range, component)
        const updatableContainer = !this.definition.isVector
        return containerPromise.then(containerItem => {
          const defs: SvgItems = []
          // TODO: make luminance a property of container...
          const luminance = true
          const updatableContent = !content.definition.isVector 
          
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
          if (svgFilter) defs.push(svgFilter)
          else containerItem.removeAttribute('filter')
          const contentSvgFilter = content.contentSvgFilter(contentItem, size, containerRect, time, range)
          if (contentSvgFilter) defs.push(contentSvgFilter)
          else contentItem.removeAttribute('filter')
        
          const useSvg = (updatableContent || updatableContainer) && component === ComponentPlayer
          const svg = useSvg ? this.svgElement : svgSvgElement()
          svgSetChildren(svg, [svgDefsElement(defs), ...items])
          svgSetDimensions(svg, size)

          return [svg]
        })
      })
      return containedPromise
    }

    containerColorCommandFilters(args: VisibleCommandFilterArgs): CommandFilters {
      const commandFilters: CommandFilters = []
      const { contentColors, containerRects, track } = args
    
      const { colorMaximize } = this
      if (!colorMaximize) return super.containerColorCommandFilters(args)
      
      assertPopulatedArray(contentColors)

      const tweeningSize = !rectsEqual(...containerRects)
      const maxSize = tweeningSize ? tweenMaxSize(...containerRects) : containerRects[0]
      const colorArgs: VisibleCommandFilterArgs = { 
        ...args, outputSize: maxSize
      }
      commandFilters.push(...this.colorBackCommandFilters(colorArgs, `content-${track}`))
      
      return commandFilters
    }

    containerCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
      const commandFilters: CommandFilters = []
      const { contentColors, filterInput: input } = args
      let filterInput = input
      // console.log(this.constructor.name, 'containerCommandFilters', filterInput)
      
      assertPopulatedString(filterInput, 'filterInput')

      if (!contentColors?.length) {
        commandFilters.push(...this.alphamergeCommandFilters({ ...args, filterInput }))
        filterInput = arrayLast(arrayLast(commandFilters).outputs)
      } 

      commandFilters.push(...this.containerFinalCommandFilters({ ...args, filterInput }))
      return commandFilters
    }
    
    containerFinalCommandFilters(args: VisibleCommandFilterArgs): CommandFilters {
      const commandFilters: CommandFilters = []
      const { filterInput: input } = args

      let filterInput = input 
      assertPopulatedString(filterInput, 'filterInput')
     
      const opacityFilters = this.opacityCommandFilters(args)
      if (opacityFilters.length) {
        commandFilters.push(...opacityFilters)
        filterInput = arrayLast(arrayLast(opacityFilters).outputs)
      }  
      commandFilters.push(...this.translateCommandFilters({ ...args, filterInput }))
    
      return commandFilters
    }

    containerRects(args: ContainerRectArgs, inRect: Rect): RectTuple {
      // console.log(this.constructor.name, 'containerRects', inRect, args)
      const { size, time, timeRange } = args
      const { lock } = this
      const tweenRects = this.tweenRects(time, timeRange)
      const locked = tweenRectsLock(tweenRects, lock)
      
      const { width: inWidth, height: inHeight } = inRect
      
      const ratio = ((inWidth || size.width)) / ((inHeight || size.height))
      
      const [scale, scaleEnd] = locked 
      const forcedScale = tweenScaleSizeRatioLock(scale, size, ratio, lock)
      // console.log(this.constructor.name, 'containerRects forcedScale', forcedScale, '= tweenScaleSizeRatioLock(', scale, size, ratio, lock, ')')
      const { directionObject } = this
      const transformedRect = tweenScaleSizeToRect(size, forcedScale, directionObject)

      const tweening = !rectsEqual(scale, scaleEnd)
      if (!tweening) {
        // console.log(this.constructor.name, 'containerRects !tweening', transformedRect, locked)
        return [transformedRect, transformedRect]
      }

      const forcedScaleEnd = tweenScaleSizeRatioLock(scaleEnd, size, ratio, lock)
      const tweenRect = tweenOverRect(forcedScale, forcedScaleEnd)
      const tweened = tweenScaleSizeToRect(size, tweenRect, directionObject)
      const tuple: RectTuple = [transformedRect, tweened]
      return tuple
    }

    containerSvgItemPromise(containerRect: Rect, time: Time, range: TimeRange, component: Component): Promise<SvgItem> { 
      return Promise.resolve(this.pathElement(containerRect))
    }
  
    private containerSvgFilter(svgItem: SvgItem, outputSize: Size, containerRect: Rect, time: Time, clipTime: TimeRange): SVGFilterElement | undefined {
      const [opacity] = this.tweenValues('opacity', time, clipTime)
      // console.log(this.constructor.name, 'containerSvgFilters', opacity)
      if (!isBelowOne(opacity)) return 
      
      const { opacityFilter } = this
      opacityFilter.setValue(opacity, 'opacity')
      return svgFilterElement(opacityFilter.filterSvgFilter(), svgItem)
    }

    declare definition: ContainerDefinition
    
    get directions() { return Directions }

    get directionObject(): SideDirectionObject {
      return Object.fromEntries(SideDirections.map(direction => 
        [direction, !!this.value(`off${direction.slice(0, 1).toUpperCase()}`)]
      ))
    }

    private _div?: HTMLDivElement
    private get div() { 
      return this._div ||= globalThis.document.createElement('div')
    }
    get isDefault() { return this.mediaId === DefaultContainerId }


    declare height: number

    declare offE: boolean
    declare offN: boolean
    declare offS: boolean
    declare offW: boolean
    declare opacity: number
    
    opacityCommandFilters(args: CommandFilterArgs): CommandFilters {
      const { outputSize: outputSize, filterInput, clipTime, time, videoRate } = args
      assertTimeRange(clipTime)
      const duration = isTimeRange(time) ? time.lengthSeconds : 0
      const commandFilters: CommandFilters = []
      const filterCommandFilterArgs: FilterCommandFilterArgs = {
        dimensions: outputSize, filterInput, videoRate, duration
      }
      const [opacity, opacityEnd] = this.tweenValues('opacity', time, clipTime)
      // console.log(this.constructor.name, 'opacityCommandFilters', opacity, opacityEnd)
      if (isBelowOne(opacity) || (isDefined(opacityEnd) && isBelowOne(opacityEnd))) {
        const { opacityFilter } = this
        opacityFilter.setValues({ opacity, opacityEnd })
        commandFilters.push(...opacityFilter.commandFilters(filterCommandFilterArgs))
      }
      
      return commandFilters
    }

    private _opacityFilter?: Filter
    get opacityFilter() { return this._opacityFilter ||= filterFromId('opacity')}
    
    pathElement(rect: Rect, forecolor = 'none'): SvgItem {
      return svgPolygonElement(rect, '', forecolor)
    }

    private _svgElement?: SVGSVGElement
    private get svgElement() { 
      return this._svgElement ||= svgSvgElement() 
    }
  
    translateCommandFilters(args: CommandFilterArgs): CommandFilters {
      const commandFilters: CommandFilters = []
      const { 
        outputSize, time, containerRects, chainInput, filterInput, videoRate
      } = args
      if (!chainInput) return commandFilters

      assertPopulatedArray(containerRects)
      const [rect, rectEnd] = containerRects
      const duration = isTimeRange(time) ? time.lengthSeconds : 0
      const { overlayFilter } = this

      // overlayFilter.setValue('yuv420p10', 'format')
      overlayFilter.setValue(rect.x, 'x')
      overlayFilter.setValue(rect.y, 'y')
      if (duration) {
        overlayFilter.setValue(rectEnd.x, `x${PropertyTweenSuffix}`)
        overlayFilter.setValue(rectEnd.y, `y${PropertyTweenSuffix}`)
      }
      const filterArgs: FilterCommandFilterArgs = {
        dimensions: outputSize, filterInput, videoRate, duration, chainInput
      }
      commandFilters.push(...overlayFilter.commandFilters(filterArgs))
      return commandFilters
    }

    declare width: number

    declare x: number

    declare y: number
  }
}

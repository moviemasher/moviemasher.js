import { LoadedVideo, PreviewItems, SvgItem, SvgItems } from "../declarations"
import { Rect, rectsEqual, RectTuple } from "../Utility/Rect"
import { Size, sizeCopy } from "../Utility/Size"
import { CommandFilterArgs, CommandFilters, FilterCommandFilterArgs, VisibleCommandFilterArgs } from "../MoveMe"
import { Filter } from "../Filter/Filter"
import { Anchors, DataType, DirectionObject, Directions } from "../Setup/Enums"
import { assertObject, assertPopulatedArray, assertPopulatedString, assertTimeRange, assertTrue, isBelowOne, isDefined, isTimeRange } from "../Utility/Is"
import { Container, ContainerClass, DefaultContainerId, ContainerDefinition, ContainerRectArgs } from "./Container"
import { arrayLast } from "../Utility/Array"
import { filterFromId } from "../Filter/FilterFactory"
import { svgAddClass, svgAppend, svgDefsElement, svgElement, svgFilterElement, svgGroupElement, svgMaskElement, svgPolygonElement, svgSet, svgSetChildren, svgSetDimensions, svgUrl, svgUseElement } from "../Utility/Svg"
import { TweenableClass } from "../Mixin/Tweenable/Tweenable"
import { Time, TimeRange } from "../Helpers/Time/Time"
import { PropertyTweenSuffix } from "../Base/Propertied"
import { Tweening, tweenMaxSize, tweenOverRect, tweenRectsLock, tweenScaleSizeRatioLock, tweenScaleSizeToRect } from "../Utility/Tween"
import { DataGroup, propertyInstance } from "../Setup/Property"
import { Errors } from "../Setup/Errors"
import { idGenerateString } from "../Utility/Id"
import { isUpdatableSize } from "../Mixin/UpdatableSize/UpdatableSize"
import { isLoadedImage, isLoadedVideo } from "../Loader/Loader"
import { colorWhite } from "../Utility/Color"
import { Content } from "../Content/Content"
import { NamespaceSvg } from "../Setup/Constants"
import { pointCopy, PointZero } from "../Utility/Point"


export function ContainerMixin<T extends TweenableClass>(Base: T): ContainerClass & T {
  return class extends Base implements Container {
    constructor(...args: any[]) {
      super(...args)
      const [object] = args
      
      const { container } = this
      if (container) {
        this.addProperties(object, propertyInstance({
          name: 'x', type: DataType.Percent, defaultValue: 0.5,
          group: DataGroup.Point, tweenable: true, 
        }))
        this.addProperties(object, propertyInstance({
          name: 'y', type: DataType.Percent, defaultValue: 0.5,
          group: DataGroup.Point, tweenable: true, 
        }))
        // offN, offS, offE, offW
        Directions.forEach(direction => {
          this.addProperties(object, propertyInstance({
            name: `off${direction}`, type: DataType.Boolean, 
            group: DataGroup.Point,
          }))
        })
        
        this.addProperties(object, propertyInstance({
          tweenable: true, name: 'opacity', 
          type: DataType.Percent, defaultValue: 1.0,
          group: DataGroup.Opacity,
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
    

    private containedVideo(video: LoadedVideo, containerRect: Rect, size: Size, time: Time, range: TimeRange): Promise<PreviewItems> {
      const x = Math.round(Number(video.getAttribute('x')))
      const y = Math.round(Number(video.getAttribute('y')))
      const containerPoint = pointCopy(containerRect)
      containerPoint.x -= x
      containerPoint.y -= y
      
      const zeroRect = { ...containerPoint, ...sizeCopy(containerRect)}
      const updatableContainer = isUpdatableSize(this)

      const items: PreviewItems = []
      const { div } = this
      const styles: string[] = []
      styles.push(`left: ${x}px`)
      styles.push(`top: ${y}px`)
      if (updatableContainer) {

        const file = this.intrinsicGraphFile({ size: true, editing: true })
        const { preloader } = this.clip.track.mash
        const src = preloader.sourceUrl(file)
        styles.push(`mask-image: url(${src})`)
        styles.push('mask-repeat: no-repeat')
        styles.push('mask-mode: luminance')
        styles.push(`mask-size: ${zeroRect.width}px ${zeroRect.height}px`)
        styles.push(`mask-position: ${zeroRect.x}px ${zeroRect.y}px`)
      } else {
        const containerItem = this.pathElement(zeroRect)
        containerItem.setAttribute('fill', colorWhite)
        let clipId = idGenerateString() 
        const clipElement = globalThis.document.createElementNS(NamespaceSvg, 'clipPath')
        svgSet(clipElement, clipId)
        svgAppend(clipElement, containerItem)
        
        const svg = svgElement(size)
        svgSetChildren(svg, [svgDefsElement([clipElement])])
        
        styles.push(`clip-path:${svgUrl(clipId)}`)
        items.push(svg)
      }
      div.setAttribute('style', styles.join(';') + ';')
      svgSetChildren(div, [video])
        
      items.push(div)
      
    
      
             return Promise.resolve(items)

    }

    containedContent(content: Content, containerRect: Rect, size: Size, time: Time, range: TimeRange, icon?: boolean): Promise<PreviewItems> {
      const updatableContainer = isUpdatableSize(this)
      const updatableContent = isUpdatableSize(content)
      
      const contentPromise = content.contentPreviewItemPromise(containerRect, time, range, icon)
      const containedPromise = contentPromise.then(contentItem => {
        assertObject(contentItem)
        
        if (isLoadedVideo(contentItem)) {
          assertTrue(!icon, 'not icon')
          // console.log(this.constructor.name, "containedContent VIDEO")
          return this.containedVideo(contentItem, containerRect, size, time, range)
        }   

        const containerPromise = this.containerPreviewItemPromise(containerRect, time, range, icon)
        return containerPromise.then(containerItem => {
          const defs: SvgItems = []
          // TODO: make luminance a property of container...
          const luminance = true

          defs.push(containerItem)
          let containerId = idGenerateString() 
          if (updatableContainer && !icon) {
            // container is image/video so we need to add a polygon for hover
            const polygonElement = svgPolygonElement(containerRect, '', 'transparent', containerId)
            polygonElement.setAttribute('vector-effect', 'non-scaling-stroke;')
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
            containerItem.setAttribute('vector-effect', 'non-scaling-stroke;')
            useContainerInMask.setAttribute('fill', colorWhite)
          }
          const containerSvgFilter = this.containerSvgFilter(containerItem, size, containerRect, time, range)
          if (containerSvgFilter) defs.push(containerSvgFilter)
          else containerItem.removeAttribute('filter')
          const contentSvgFilter = content.contentSvgFilter(contentItem, size, containerRect, time, range)
          if (contentSvgFilter) defs.push(contentSvgFilter)
          else contentItem.removeAttribute('filter')
        

          const useSvg = (updatableContent || updatableContainer) && !icon
          const svg = useSvg ? this.svgElement : svgElement()
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
      // console.log(this.constructor.name, "containerCommandFilters", filterInput)
      
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
      // console.log(this.constructor.name, "containerRects", inRect, args)
      const { size, time, timeRange } = args
      const { lock } = this
      const tweenRects = this.tweenRects(time, timeRange)
      const locked = tweenRectsLock(tweenRects, lock)
      
      const { width: inWidth, height: inHeight } = inRect
      
      const ratio = ((inWidth || size.width)) / ((inHeight || size.height))
      
      const [scale, scaleEnd] = locked 
      const forcedScale = tweenScaleSizeRatioLock(scale, size, ratio, lock)
      // console.log(this.constructor.name, "containerRects forcedScale", forcedScale, "= tweenScaleSizeRatioLock(", scale, size, ratio, lock, ")")
      const { directionObject } = this
      const transformedRect = tweenScaleSizeToRect(size, forcedScale, directionObject)

      const tweening = !rectsEqual(scale, scaleEnd)
      if (!tweening) {
        // console.log(this.constructor.name, "containerRects !tweening", transformedRect, locked)
        return [transformedRect, transformedRect]
      }

      const forcedScaleEnd = tweenScaleSizeRatioLock(scaleEnd, size, ratio, lock)
      const tweenRect = tweenOverRect(forcedScale, forcedScaleEnd)
      const tweened = tweenScaleSizeToRect(size, tweenRect, directionObject)
      const tuple: RectTuple = [transformedRect, tweened]
      return tuple
    }

    containerPreviewItemPromise(containerRect: Rect, time: Time, range: TimeRange, icon?: boolean): Promise<SvgItem> { 
      return Promise.resolve(this.pathElement(containerRect))
    }
  
    containerSvgFilter(svgItem: SvgItem, outputSize: Size, containerRect: Rect, time: Time, clipTime: TimeRange): SVGFilterElement | undefined {
      const [opacity] = this.tweenValues('opacity', time, clipTime)
      // console.log(this.constructor.name, "containerSvgFilters", opacity)
      if (!isBelowOne(opacity)) return 
      
      const { opacityFilter } = this
      opacityFilter.setValue(opacity, 'opacity')
      return svgFilterElement(opacityFilter.filterSvgFilter(), svgItem)
    }


    declare definition: ContainerDefinition
    
    get directions() { return Anchors }

    get directionObject(): DirectionObject {
      return Object.fromEntries(Directions.map(direction => 
        [direction, !!this.value(`off${direction}`)]
      ))
    }

    private _div?: HTMLDivElement
    private get div() { 
      return this._div ||= globalThis.document.createElement('div')
    }
    get isDefault() { return this.definitionId === DefaultContainerId }


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
      // console.log(this.constructor.name, "opacityCommandFilters", opacity, opacityEnd)
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
      return this._svgElement ||= svgElement() 
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

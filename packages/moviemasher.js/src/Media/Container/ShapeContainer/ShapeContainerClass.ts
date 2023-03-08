import { ShapeContainer, ShapeContainerDefinition } from "./ShapeContainer"
import { NamespaceSvg } from "../../../Setup/Constants"
import { colorBlack, colorBlackOpaque, colorWhite } from "../../../Helpers/Color/ColorConstants"
import { ValueRecord } from "../../../Types/Core"
import { SvgItem } from "../../../Helpers/Svg/Svg"
import { Rect, rectsEqual, RectTuple } from "../../../Utility/Rect"
import { Size, sizeAboveZero, sizeEven, sizesEqual } from "../../../Utility/Size"
import { CommandFile, CommandFileArgs, CommandFiles, CommandFilter, CommandFilterArgs, CommandFilters, Component, FilterCommandFilterArgs, PreloadArgs, VisibleCommandFileArgs, VisibleCommandFilterArgs } from "../../../Base/Code"
import { DataType, GraphFileType } from "../../../Setup/Enums"
import { ContainerMixin } from "../ContainerMixin"
import { assertPopulatedArray, assertPopulatedString, isBoolean, isPopulatedArray, isPopulatedString, isTimeRange } from "../../../Utility/Is"
import { commandFilesInput } from "../../../Utility/CommandFiles"
import { arrayLast } from "../../../Utility/Array"
import { TweenableMixin } from "../../../Mixin/Tweenable/TweenableMixin"
import { Tweening, tweenMaxSize } from "../../../Utility/Tween"
import { DataGroup, propertyInstance } from "../../../Setup/Property"
import { idGenerate } from "../../../Utility/Id"
import { PropertyTweenSuffix } from "../../../Base/Propertied"
import { PointZero } from "../../../Utility/Point"
import { svgPathElement, svgPolygonElement, svgSetTransformRects, svgTransform } from "../../../Helpers/Svg/SvgFunctions"
import { MediaInstanceBase } from "../../MediaInstanceBase"
import { Time, TimeRange } from "../../../Helpers"
import { ContentRectArgs } from "../../Content"
import { Effects } from "../../Effect"
import { IntrinsicOptions } from "../../Mash/Track/Clip/Clip"

const ShapeContainerWithTweenable = TweenableMixin(MediaInstanceBase)
const ShapeContainerWithContainer = ContainerMixin(ShapeContainerWithTweenable)
export class ShapeContainerClass extends ShapeContainerWithContainer implements ShapeContainer {
  constructor(...args: any[]) {
    super(...args)
    const [object] = args
    this.addProperties(object, propertyInstance({
      tweenable: true, name: 'width', type: DataType.Percent, 
      group: DataGroup.Size, defaultValue: 1.0, max: 2.0
    }))
    this.addProperties(object, propertyInstance({
      tweenable: true, name: 'height', type: DataType.Percent, 
      group: DataGroup.Size, defaultValue: 1.0, max: 2.0
    }))
  }


  
  audibleCommandFiles(args: CommandFileArgs): CommandFiles {
    throw new Error("Method not implemented.")
  }
  audibleCommandFilters(args: CommandFilterArgs): CommandFilters {
    throw new Error("Method not implemented.")
  }
  contentPreviewItemPromise(containerRect: Rect, time: Time, range: TimeRange, component: Component): Promise<SvgItem> {
    throw new Error("Method not implemented.")
  }
  contentRects(args: ContentRectArgs): RectTuple {
    throw new Error("Method not implemented.")
  }
  contentSvgFilter(contentItem: SvgItem, outputSize: Size, containerRect: Rect, time: Time, clipTime: TimeRange): SVGFilterElement | undefined {
    throw new Error("Method not implemented.")
  }
  contentSvgItemPromise(containerRect: Rect, time: Time, range: TimeRange, component: Component): Promise<SvgItem> {
    throw new Error("Method not implemented.")
  }
  effects: Effects = []
  effectsCommandFiles(args: VisibleCommandFileArgs): CommandFiles {
    throw new Error("Method not implemented.")
  }
  svgItemForPlayerPromise(rect: Rect, time: Time, range: TimeRange): Promise<SvgItem> {
    throw new Error("Method not implemented.")
  }
  svgItemForTimelinePromise(rect: Rect, time: Time, range: TimeRange): Promise<SvgItem> {
    throw new Error("Method not implemented.")
  }



  canColor(args: CommandFilterArgs): boolean { 
    const { isDefault } = this

    // default rect has no content to colorize, so needs color filter input
    if (isDefault) return false

    // shape files can only colorize a single color at a single size
    return !this.isTweeningColor(args)
  }
  
  containerColorCommandFilters(args: VisibleCommandFilterArgs): CommandFilters {
    const commandFilters: CommandFilters = [] 
    // i am either default rect or a shape tweening color

    const { colorFilter, isDefault } = this
    const { contentColors, containerRects, videoRate, duration } = args
    assertPopulatedArray(contentColors, 'contentColors')

    const [rect, rectEnd] = containerRects
    const [color, colorEnd] = contentColors
    const maxSize = isDefault ? rect : tweenMaxSize(...containerRects)
    const colorArgs: FilterCommandFilterArgs = { videoRate, duration } 
   
    colorFilter.setValue(color || colorWhite, 'color')
    colorFilter.setValue(colorEnd, `color${PropertyTweenSuffix}`)
    colorFilter.setValue(maxSize.width, 'width')
    colorFilter.setValue(maxSize.height, 'height')
    
    const tweenSize = isDefault 
    if (tweenSize) colorFilter.setValue(rectEnd.width , `width${PropertyTweenSuffix}`)
    if (tweenSize) colorFilter.setValue(rectEnd.height, `height${PropertyTweenSuffix}`)

    commandFilters.push(...colorFilter.commandFilters(colorArgs))
    return commandFilters
  }

  containerCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
    const commandFilters: CommandFilters = [] 
    const { 
      contentColors: colors, commandFiles, filterInput: input 
    } = args

    let filterInput = input
    // console.log(this.constructor.name, "containerCommandFilters", filterInput)


    const noContentFilters = isPopulatedArray(colors)
    const alpha = this.requiresAlpha(args, !!tweening.size)
    if (alpha) {
      assertPopulatedString(filterInput, 'container input')
      const { contentColors: _, ...argsWithoutColors } = args
      const superArgs: VisibleCommandFilterArgs = { 
        ...argsWithoutColors, filterInput
      }

      commandFilters.push(...super.containerCommandFilters(superArgs, tweening))
    } else if (this.isDefault || noContentFilters) {
      const { id } = this
      // if (!filterInput) console.log(this.constructor.name, "containerCommandFilters calling commandFilesInput", id)
      
      filterInput ||= commandFilesInput(commandFiles, id, true)
      assertPopulatedString(filterInput, 'final input')
      
      commandFilters.push(...this.containerFinalCommandFilters({ ...args, filterInput}))
    }
    return commandFilters
  }

  declare definition: ShapeContainerDefinition

  hasIntrinsicSizing = true

  initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container = false): CommandFilters {
    const commandFilters: CommandFilters = [] 
    const { contentColors, ...argsWithoutColors } = args

    const { 
      commandFiles, track, filterInput: input, containerRects, videoRate
    } = argsWithoutColors

    let filterInput = input 
    const alpha = this.requiresAlpha(args, !!tweening.size)
    const { isDefault } = this
    const tweeningSize = tweening.size // !(isDefault ? rectsEqual(...containerRects) : sizesEqual(...containerRects))
    const maxSize = tweeningSize ? tweenMaxSize(...containerRects) : containerRects[0]
    const evenSize = sizeEven(maxSize)
    const contentInput = `content-${track}`
    const containerInput = `container-${track}`
  
    if (!tweening.canColor) {
      if (isPopulatedString(filterInput) && !isDefault) {
        if (alpha) {
          const formatFilter = 'format'
          const formatFilterId = idGenerate(formatFilter)
          const formatCommandFilter: CommandFilter = {
            inputs: [filterInput], ffmpegFilter: formatFilter, 
            options: { pix_fmts: 'yuv420p' },
            outputs: [formatFilterId]
          }
          commandFilters.push(formatCommandFilter)
          filterInput = formatFilterId
        } else if (!sizesEqual(evenSize, maxSize)) {
          const colorArgs: VisibleCommandFilterArgs = { 
            ...args, 
            contentColors: [colorBlackOpaque, colorBlackOpaque], 
            outputSize: evenSize
          }
          commandFilters.push(...this.colorBackCommandFilters(colorArgs, `${contentInput}-back`))
          const colorInput = arrayLast(arrayLast(commandFilters).outputs) 
          assertPopulatedString(filterInput, 'overlay input')
      
          commandFilters.push(...this.overlayCommandFilters(colorInput, filterInput))
          filterInput = arrayLast(arrayLast(commandFilters).outputs)  
        }
      }   
    }
    
    if (commandFilters.length) arrayLast(commandFilters).outputs = [contentInput]
    else if (isPopulatedString(filterInput) && contentInput !== filterInput) {
      commandFilters.push(this.copyCommandFilter(filterInput, track))
    }

    if (alpha) {
      const { id } = this
      // console.log(this.constructor.name, "initialCommandFilters ALPHA calling commandFilesInput", id)
      const fileInput = commandFilesInput(commandFiles, id, true)   
      assertPopulatedString(fileInput, 'scale input')


      const colorArgs: VisibleCommandFilterArgs = { 
        ...args, 
        contentColors: [colorBlackOpaque, colorBlackOpaque], 
        outputSize: maxSize
      }
      commandFilters.push(...this.colorBackCommandFilters(colorArgs, `${containerInput}-back`))
      const colorInput = arrayLast(arrayLast(commandFilters).outputs) 

      commandFilters.push(...this.scaleCommandFilters({ ...args, filterInput: fileInput }))
      filterInput = arrayLast(arrayLast(commandFilters).outputs) 

      assertPopulatedString(filterInput, 'overlay input')
    
      commandFilters.push(...this.overlayCommandFilters(colorInput, filterInput))
      filterInput = arrayLast(arrayLast(commandFilters).outputs)         
  
      const cropArgs: FilterCommandFilterArgs = { duration: 0, videoRate }
      assertPopulatedString(filterInput, 'crop input')

      const { cropFilter } = this
      cropFilter.setValue(maxSize.width, "width")
      cropFilter.setValue(maxSize.height, "height")
      cropFilter.setValue(0, "x")
      cropFilter.setValue(0, "y")
      commandFilters.push(...cropFilter.commandFilters({ ...cropArgs, filterInput }))
      filterInput = arrayLast(arrayLast(commandFilters).outputs) 
      assertPopulatedString(filterInput, 'format input')

      const formatFilter = 'format'
      const formatCommandFilter: CommandFilter = {
        inputs: [filterInput], ffmpegFilter: formatFilter, 
        options: { pix_fmts: alpha ? 'yuv420p' : 'yuva420p' },
        outputs: [containerInput]
      }
      commandFilters.push(formatCommandFilter)
    } 
    return commandFilters
  }

  intrinsicRect(editing = false): Rect {
    const { pathHeight: height, pathWidth: width} = this.definition
    // console.log(this.constructor.name, "intrinsicRect", this.definition)
    return { width, height, ...PointZero }
  }

  intrinsicsKnown(options: IntrinsicOptions): boolean {
    return true
  }

  isTweeningColor(args: CommandFileArgs): boolean {
    const { contentColors } = args
    if (!isPopulatedArray(contentColors)) return false

    const [forecolor, forecolorEnd] = contentColors
    return forecolor !== forecolorEnd
  }

  isTweeningSize(args: CommandFileArgs): boolean {
    const { containerRects } = args
    if (!isPopulatedArray(containerRects)) {
      // console.log(this.constructor.name, "isTweeningSize FALSE BECAUSE containerRects NOT ARRAY", args)
      return false
    }

    const equal = rectsEqual(...containerRects)
    if (equal) {
      // console.log(this.constructor.name, "isTweeningSize FALSE BECAUSE containerRects EQUAL", args)
    }
    return !equal
  }

  loadPromise(args: PreloadArgs): Promise<void> {
    return Promise.resolve()
  }

  
  pathElement(rect: Rect, forecolor = ''): SvgItem {
    const { definition } = this
    const inRect = this.intrinsicRect(true)
    if (!sizeAboveZero(inRect)) {
      const polygonElement = svgPolygonElement(rect, '', forecolor)
      return polygonElement
    }
    const { path } = definition
    
    const pathElement = svgPathElement(path, '')
    svgSetTransformRects(pathElement, inRect, rect)
    
    return pathElement
  }

  requiresAlpha(args: CommandFileArgs, tweeningSize?: boolean): boolean {
    const { contentColors } = args
    const colorContent = isPopulatedArray(contentColors)
    if (this.isDefault) {
      if (colorContent) return false // can always make colored boxes

      if (isBoolean(tweeningSize)) return tweeningSize

      return this.isTweeningSize(args) // need mask to dynamically crop content
    }
    if (!colorContent) return true // always need to mask content

    return this.isTweeningColor(args)//tweeningSize || 
  
  }

  visibleCommandFiles(args: VisibleCommandFileArgs): CommandFiles {
    const { isDefault, id } = this
    const alpha = this.requiresAlpha(args)
    const tweeningColor = this.isTweeningColor(args)
    if (isDefault && !alpha) {
      // console.log(this.constructor.name, "commandFiles NONE", id, isDefault, alpha, tweeningColor)
      return []
    }
    const { definition } = this
    const { path } = definition
    const { contentColors: colors = [], containerRects, time, videoRate } = args
    assertPopulatedArray(containerRects, 'containerRects')

    const duration = isTimeRange(time) ? time.lengthSeconds : 0
    const [rect, rectEnd] = containerRects
    const maxSize = { ...PointZero, ...tweenMaxSize(rect, rectEnd)}
    const { width: maxWidth, height: maxHeight} = maxSize

    let [forecolor] = colors
    if (alpha) forecolor = colorWhite
    else if (tweeningColor) forecolor = colorBlack
   
    let fill = 'none'
    if (isDefault) fill = colorWhite
    else if (alpha) fill = colorBlack

    const intrinsicRect = isDefault ? maxSize : this.intrinsicRect()
    const { width: inWidth, height: inHeight } = intrinsicRect
    const dimensionsString = `width="${inWidth}" height="${inHeight}"`

    const transformAttribute = svgTransform(intrinsicRect, maxSize)
    const tags: string[] = []
    tags.push(`<svg viewBox="0 0 ${maxWidth} ${maxHeight}" xmlns="${NamespaceSvg}">`)
    tags.push(`<g ${dimensionsString} transform="${transformAttribute}" >`)
    tags.push(`<rect ${dimensionsString} fill="${fill}"/>`)
    if (!isDefault) tags.push(`<path d="${path}" fill="${forecolor}"/>`)
    tags.push("</g>")
    tags.push("</svg>")
    const svgTag = tags.join("")
  
    const options: ValueRecord = {}
    if (duration) {
      options.loop = 1
      options.framerate = videoRate
      options.t = duration
      // options.re = ''
    }
    const commandFile: CommandFile = { 
      type: GraphFileType.Svg, file: id, content: svgTag, 
      input: true, inputId: id, definition, options
    }
  
    return [commandFile]
  }
}



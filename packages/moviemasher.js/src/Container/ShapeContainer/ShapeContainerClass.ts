import { ShapeContainer, ShapeContainerDefinition } from "./ShapeContainer"
import { InstanceBase } from "../../Instance/InstanceBase"
import { NamespaceSvg } from "../../Setup/Constants"
import { colorBlack, colorBlackOpaque, colorWhite } from "../../Utility/Color"
import { SvgItem, ValueObject } from "../../declarations"
import { Rect, rectsEqual } from "../../Utility/Rect"
import { sizeAboveZero, sizeEven, sizesEqual } from "../../Utility/Size"
import { CommandFile, CommandFileArgs, CommandFiles, CommandFilter, CommandFilterArgs, CommandFilters, FilterCommandFilterArgs, VisibleCommandFileArgs, VisibleCommandFilterArgs } from "../../MoveMe"
import { DataType, GraphFileType } from "../../Setup/Enums"
import { ContainerMixin } from "../ContainerMixin"
import { assertPopulatedArray, assertPopulatedString, isBoolean, isPopulatedArray, isPopulatedString, isTimeRange } from "../../Utility/Is"
import { commandFilesInput } from "../../Utility/CommandFiles"
import { arrayLast } from "../../Utility/Array"
import { TweenableMixin } from "../../Mixin/Tweenable/TweenableMixin"
import { Tweening, tweenMaxSize } from "../../Utility/Tween"
import { DataGroup, propertyInstance } from "../../Setup/Property"
import { idGenerate } from "../../Utility/Id"
import { PropertyTweenSuffix } from "../../Base/Propertied"
import { PointZero } from "../../Utility/Point"
import { svgPathElement, svgPolygonElement, svgSetTransformRects, svgTransform } from "../../Utility/Svg"

const ShapeContainerWithTweenable = TweenableMixin(InstanceBase)
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
    colorFilter.setValue(tweenSize ? rectEnd.width : undefined, `width${PropertyTweenSuffix}`)
    colorFilter.setValue(tweenSize ? rectEnd.height : undefined, `height${PropertyTweenSuffix}`)
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
      commandFiles, upload, track, filterInput: input, containerRects, videoRate
    } = argsWithoutColors

    if (upload) return commandFilters

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

  isTweeningColor(args: CommandFileArgs): boolean {
    const { contentColors } = args
    if (!isPopulatedArray(contentColors)) return false

    let [forecolor, forecolorEnd] = contentColors
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

  pathElement(rect: Rect, forecolor: string = ''): SvgItem {
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
    // console.log(this.constructor.name, "visibleCommandFiles", this.definitionId, rect, rectEnd, intrinsicRect)

    const transformAttribute = svgTransform(intrinsicRect, maxSize)
    // console.log(this.constructor.name, "visibleCommandFiles", rect, rectEnd, transformAttribute)
    const tags: string[] = []
    tags.push(`<svg viewBox="0 0 ${maxWidth} ${maxHeight}" xmlns="${NamespaceSvg}">`)
    tags.push(`<g ${dimensionsString} transform="${transformAttribute}" >`)
    tags.push(`<rect ${dimensionsString} fill="${fill}"/>`)
    if (!isDefault) tags.push(`<path d="${path}" fill="${forecolor}"/>`)
    tags.push("</g>")
    tags.push("</svg>")
    const svgTag = tags.join("")
  
    const options: ValueObject = {}
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
    // console.log(this.constructor.name, "visibleCommandFiles", commandFile)
  
    return [commandFile]
  }
}



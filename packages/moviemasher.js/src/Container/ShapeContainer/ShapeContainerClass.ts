import { ShapeContainer, ShapeContainerDefinition } from "./ShapeContainer"
import { InstanceBase } from "../../Instance/InstanceBase"
import { NamespaceSvg } from "../../Setup/Constants"
import { colorBlack, colorBlackOpaque, colorWhite } from "../../Utility/Color"
import { SvgItem, ValueObject } from "../../declarations"
import { Rect, rectsEqual } from "../../Utility/Rect"
import { Size, sizeAboveZero, sizeEven, sizesEqual } from "../../Utility/Size"
import { CommandFile, CommandFileArgs, CommandFiles, CommandFilter, CommandFilterArgs, CommandFilters, FilterCommandFilterArgs, VisibleCommandFilterArgs } from "../../MoveMe"
import { DataType, GraphFileType } from "../../Setup/Enums"
import { ContainerMixin } from "../ContainerMixin"
import { assertPopulatedArray, assertPopulatedString, assertTrue, isPopulatedArray, isPopulatedString, isTimeRange } from "../../Utility/Is"
import { commandFilesInput } from "../../Utility/CommandFiles"
import { arrayLast } from "../../Utility/Array"
import { TweenableMixin } from "../../Mixin/Tweenable/TweenableMixin"
import { Tweening, tweenMaxSize, tweenRectScale } from "../../Utility/Tween"
import { DataGroup, propertyInstance } from "../../Setup/Property"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { idGenerate } from "../../Utility/Id"
import { PropertyTweenSuffix } from "../../Base/Propertied"
import { PointZero } from "../../Utility/Point"
import { svgPolygonElement } from "../../Utility/Svg"
import { Actions } from "../../Editor/Actions/Actions"
import { Editor } from "../../Editor/Editor"

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
    if (this.isTweeningColor(args)) return false


    return true //!( || this.isTweeningSize(args))
  }


  commandFiles(args: CommandFileArgs): CommandFiles {
    const commandFiles: CommandFiles = []
    const { isDefault } = this
    const requiresAlpha = this.requiresAlpha(args)
    const tweeningColor = this.isTweeningColor(args)
    if (isDefault && !requiresAlpha) {
      // console.log(this.constructor.name, "commandFiles NONE", isDefault, requiresAlpha, tweeningColor, tweeningSize)
      return commandFiles
    }
    const { definition, id } = this
    const { path } = definition
    const { contentColors: colors = [], containerRects, time, videoRate } = args

    assertPopulatedArray(containerRects, 'containerRects')
    const duration = isTimeRange(time) ? time.lengthSeconds : 0
    const [rect, rectEnd] = containerRects
    const maxSize = tweenMaxSize(rect, rectEnd)
    const { width: maxWidth, height: maxHeight} = maxSize

    let [forecolor] = colors
    if (requiresAlpha) forecolor = colorWhite
    else if (tweeningColor) forecolor = colorBlack
   
    let backcolor = 'none'
    if (isDefault) backcolor = colorWhite
    else if (requiresAlpha) backcolor = colorBlack

    const intrinsicRect = isDefault ? maxSize : this.intrinsicRect()
    const { width: inWidth, height: inHeight } = intrinsicRect
    const dimensionsString = `width="${inWidth}" height="${inHeight}"`
    const transformAttribute = tweenRectScale(intrinsicRect, maxSize)

    // console.log(this.constructor.name, "commandFiles", forecolor, backcolor, tweeningColor, noContentFilters)
    const tags: string[] = []
    tags.push(`<svg viewBox="0 0 ${maxWidth} ${maxHeight}" xmlns="${NamespaceSvg}">`)
    tags.push(`<g ${dimensionsString} transform="${transformAttribute}" >`)
    tags.push(`<rect ${dimensionsString} fill="${backcolor}"/>`)
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
      type: GraphFileType.Svg, file: svgTag, 
      input: true, inputId: id, definition, options
    }
    commandFiles.push(commandFile)
    return commandFiles
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

  
  // canColorTween(args: CommandFilterArgs): boolean { 
  //   const { isDefault } = this
  //   if (isDefault) return true

  //   return false //!this.isTweeningSize(args)
  // }

  // colorMaximize = true
  containerCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
    const commandFilters: CommandFilters = [] 
    const { 
      contentColors: colors, commandFiles, filterInput: input 
    } = args

    let filterInput = input
    // console.log(this.constructor.name, "containerCommandFilters", filterInput)


    const noContentFilters = isPopulatedArray(colors)
    const requiresAlpha = this.requiresAlpha(args)
    if (requiresAlpha) {
      assertPopulatedString(filterInput, 'container input')
      const { contentColors: _, ...argsWithoutColors } = args
      const superArgs: VisibleCommandFilterArgs = { 
        ...argsWithoutColors, filterInput
      }

      commandFilters.push(...super.containerCommandFilters(superArgs, tweening))
    } else if (this.isDefault || noContentFilters) {
      filterInput ||= commandFilesInput(commandFiles, this.id, true)
      assertPopulatedString(filterInput, 'final input')
      
      // add effects...
      const effectsFilters = this.effectsCommandFilters({ ...args, filterInput })
      if (effectsFilters.length) {
        commandFilters.push(...effectsFilters)
        filterInput = arrayLast(arrayLast(effectsFilters).outputs)
      }
      commandFilters.push(...this.containerFinalCommandFilters({ ...args, filterInput}))
    }
    return commandFilters
  }

  containerSvgItem(rect: Rect, time: Time, range: TimeRange): SvgItem { 
    return this.pathElement(rect, colorWhite)
  }

  declare definition: ShapeContainerDefinition

  initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container = false): CommandFilters {
    const commandFilters: CommandFilters = [] 
    const { contentColors, ...argsWithoutColors } = args
    const { 
      commandFiles, track, filterInput: input, containerRects, videoRate
    } = argsWithoutColors

    let filterInput = input 
    const requiresAlpha = this.requiresAlpha(args)
    const { isDefault } = this
    const tweeningSize = !(isDefault ? rectsEqual(...containerRects) : sizesEqual(...containerRects))
    const maxSize = tweeningSize ? tweenMaxSize(...containerRects) : containerRects[0]
    const evenSize = sizeEven(maxSize)
    const contentInput = `content-${track}`
    const containerInput = `container-${track}`
  
    if (!tweening.canColor) {
      if (isPopulatedString(filterInput) && !isDefault) {
        if (requiresAlpha) {
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


    // if (!isDefault) {
    if (requiresAlpha) {
      const fileInput = commandFilesInput(commandFiles, this.id, true)   
      

      // if (tweeningSize) { // scale container
        const colorArgs: VisibleCommandFilterArgs = { 
          ...args, 
          contentColors: [colorBlackOpaque, colorBlackOpaque], 
          outputSize: maxSize
        }
        commandFilters.push(...this.colorBackCommandFilters(colorArgs, `${containerInput}-back`))
        const colorInput = arrayLast(arrayLast(commandFilters).outputs) 
        assertPopulatedString(fileInput, 'scale input')
        commandFilters.push(...this.scaleCommandFilters({ ...args, filterInput: fileInput }))
        filterInput = arrayLast(arrayLast(commandFilters).outputs) 

        assertPopulatedString(filterInput, 'overlay input')
      
        commandFilters.push(...this.overlayCommandFilters(colorInput, filterInput))
        filterInput = arrayLast(arrayLast(commandFilters).outputs)         
      // } else filterInput = fileInput

      const cropArgs: FilterCommandFilterArgs = { duration: 0, videoRate }

      assertPopulatedString(filterInput, 'crop input')
      const { cropFilter } = this
      cropFilter.setValue(maxSize.width, "width")
      cropFilter.setValue(maxSize.height, "height")
      cropFilter.setValue(0, "x")
      cropFilter.setValue(0, "y")
      commandFilters.push(...cropFilter.commandFilters({ ...cropArgs, filterInput }))
      filterInput = arrayLast(arrayLast(commandFilters).outputs) 

      
      // if (!filterInput) console.log(this.constructor.name, "initialCommandFilters", tweeningSize)
        // reformat to rgb with or without alpha
      assertPopulatedString(filterInput, 'format input')
      const formatFilter = 'format'
      // const formatFilterId = idGenerate(formatFilter)
      const formatCommandFilter: CommandFilter = {
        inputs: [filterInput], ffmpegFilter: formatFilter, 
        options: { pix_fmts: requiresAlpha ? 'yuv420p' : 'yuva420p' },
        outputs: [containerInput]
      }
      commandFilters.push(formatCommandFilter)
    } 
    return commandFilters
  }

  intrinsicRect(editing = false): Rect {
    const { pathHeight: height, pathWidth: width} = this.definition
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
    if (!isPopulatedArray(containerRects)) return false

    return !rectsEqual(...containerRects)
  }

  pathElement(rect: Rect, forecolor = colorWhite, editor?: Editor): SvgItem {
    const { definition } = this
    const intrinsicRect = this.intrinsicRect(true)
    if (!sizeAboveZero(intrinsicRect)) {
      // console.log(this.constructor.name, "pathElement", intrinsicRect)
      const svgItem = svgPolygonElement(rect, '', forecolor)
      if (editor) this.attachHandlers(svgItem, editor)
      return svgItem
    }
    const { path } = definition
    const transformAttribute = tweenRectScale(intrinsicRect, rect)

    const svgItem = globalThis.document.createElementNS(NamespaceSvg, 'path')
    svgItem.setAttribute('d', path)
    svgItem.setAttribute('fill', forecolor)
    svgItem.setAttribute('transform', transformAttribute)
    svgItem.setAttribute('transform-origin', 'top left')

    if (editor) this.attachHandlers(svgItem, editor)

    return svgItem
  }

  requiresAlpha(args: CommandFileArgs): boolean {
    const { contentColors } = args
    const colorContent = isPopulatedArray(contentColors)
    if (this.isDefault) {
      if (colorContent) return false // can always make colored boxes

      return this.isTweeningSize(args) // need mask to dynamically crop content
    }
    if (!colorContent) return true // always need to mask content

    return this.isTweeningColor(args)//tweeningSize || 
  
  }
}



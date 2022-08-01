import { ShapeContainer, ShapeContainerDefinition } from "./ShapeContainer"
import { InstanceBase } from "../../Instance/InstanceBase"
import { NamespaceSvg } from "../../Setup/Constants"
import { colorBlack, colorBlackOpaque, colorWhite } from "../../Utility/Color"
import { SvgItem, ValueObject } from "../../declarations"
import { Rect, rectsEqual } from "../../Utility/Rect"
import { Size } from "../../Utility/Size"
import { CommandFile, CommandFileArgs, CommandFiles, CommandFilter, CommandFilterArgs, CommandFilters, FilterCommandFilterArgs } from "../../MoveMe"
import { DataType, GraphFileType } from "../../Setup/Enums"
import { ContainerMixin } from "../ContainerMixin"
import { assertPopulatedArray, assertPopulatedString, isPopulatedArray, isPopulatedString, isTimeRange } from "../../Utility/Is"
import { commandFilesInput } from "../../Utility/CommandFiles"
import { arrayLast } from "../../Utility/Array"
import { TweenableMixin } from "../../Mixin/Tweenable/TweenableMixin"
import { tweenMaxSize, tweenRectScale } from "../../Utility/Tween"
import { DataGroup, propertyInstance } from "../../Setup/Property"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { idGenerate } from "../../Utility/Id"
import { PropertyTweenSuffix } from "../../Base/Propertied"
import { PointZero } from "../../Utility/Point"

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
    return !(this.isTweeningColor(args) || this.isTweeningSize(args))
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

    const { intrinsicRect } = this
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
  
  containerColorCommandFilters(args: CommandFilterArgs): CommandFilters {
    const commandFilters: CommandFilters = [] 
    // i am either default rect or a shape tweening size or color

    const { colorFilter, isDefault } = this
    const { contentColors, containerRects, videoRate, time } = args

    assertPopulatedArray(contentColors, 'contentColors')
    assertPopulatedArray(containerRects, 'containerRects')

    const [rect, rectEnd] = containerRects
    const [color, colorEnd] = contentColors

    const maxSize = isDefault ? rect : tweenMaxSize(...containerRects)

    const duration = isTimeRange(time) ? time.lengthSeconds : 0
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
  containerCommandFilters(args: CommandFilterArgs): CommandFilters {
    const commandFilters: CommandFilters = [] 
    const { visible, contentColors: colors, containerRects, track, commandFiles, filterInput: input } = args
    if (!visible) return commandFilters

    let filterInput = input

    assertPopulatedArray(containerRects)

    const noContentFilters = isPopulatedArray(colors)
    const requiresAlpha = this.requiresAlpha(args)
    if (requiresAlpha) {
      assertPopulatedString(filterInput, 'container input')
      const { contentColors: _, ...argsWithoutColors } = args
      const superArgs: CommandFilterArgs = { 
        ...argsWithoutColors, filterInput
      }

      commandFilters.push(...super.containerCommandFilters(superArgs))
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
    return this.pathElement(rect, time, range, colorWhite)
  }

  declare definition: ShapeContainerDefinition

  needsColor(args: CommandFilterArgs): boolean {
    const { isDefault } = this
    const { contentColors, containerRects} = args
    assertPopulatedArray(containerRects)

    const tweeningSize = !rectsEqual(...containerRects)
    const colorContent = isPopulatedArray(contentColors)
    const tweeningColor = colorContent && this.isTweeningColor(args)
    if (isDefault) return tweeningSize 

    return tweeningColor || tweeningSize
  }

  initialCommandFilters(args: CommandFilterArgs): CommandFilters {
    const commandFilters: CommandFilters = [] 
    const { contentColors, ...argsWithoutColors } = args
    const { commandFiles, visible, track, filterInput: input, containerRects } = argsWithoutColors
    if (!visible) return commandFilters

    let filterInput = input 
    assertPopulatedArray(containerRects)
    const requiresAlpha = this.requiresAlpha(args)
    const tweeningSize = !rectsEqual(...containerRects)
    const maxSize = tweeningSize ? tweenMaxSize(...containerRects) : containerRects[0]

    const { isDefault } = this
    const contentInput = `content-${track}`
    const containerInput = `container-${track}`

    
    if (isPopulatedString(filterInput)) {
      if (requiresAlpha && !isDefault) {
        const formatFilter = 'format'
        const formatFilterId = idGenerate(formatFilter)
        const formatCommandFilter: CommandFilter = {
          inputs: [filterInput], ffmpegFilter: formatFilter, 
          options: { pix_fmts: 'rgba' },
          outputs: [formatFilterId]
        }
        commandFilters.push(formatCommandFilter)
        filterInput = formatFilterId
      } else if (!isDefault) {
        
        const colorArgs: CommandFilterArgs = { 
          ...args, contentColors: [colorBlackOpaque, colorBlackOpaque], outputSize: maxSize
        }
        commandFilters.push(...this.colorBackCommandFilters(colorArgs))
        const colorInput = arrayLast(arrayLast(commandFilters).outputs) 
      
        assertPopulatedString(filterInput, 'overlay input')
        const overlayArgs: CommandFilterArgs = { 
          ...args, filterInput, chainInput: colorInput
        }
        commandFilters.push(...this.mergeCommandFilters(overlayArgs))
        filterInput = arrayLast(arrayLast(commandFilters).outputs)   
      }
    } 
    
    if (commandFilters.length) arrayLast(commandFilters).outputs = [contentInput]
    else if (isPopulatedString(filterInput)) commandFilters.push(this.copyCommandFilter(filterInput, track))


    // if (!isDefault) {
    if (requiresAlpha) {
      const fileInput = commandFilesInput(commandFiles, this.id, visible)   
      

      if (tweeningSize) { // scale container
        const colorArgs: CommandFilterArgs = { 
          ...args, contentColors: [colorBlackOpaque, colorBlackOpaque], outputSize: maxSize
        }
        commandFilters.push(...this.colorBackCommandFilters(colorArgs))
        const colorInput = arrayLast(arrayLast(commandFilters).outputs) 
        assertPopulatedString(fileInput, 'scale input')
        commandFilters.push(...this.scaleCommandFilters({ ...args, filterInput: fileInput }))
        filterInput = arrayLast(arrayLast(commandFilters).outputs) 

        assertPopulatedString(filterInput, 'overlay input')
        const overlayArgs: CommandFilterArgs = { 
          ...args, filterInput, chainInput: colorInput
        }
        commandFilters.push(...this.mergeCommandFilters(overlayArgs))
        filterInput = arrayLast(arrayLast(commandFilters).outputs)         
      } else filterInput = fileInput

      if (!filterInput) console.log(this.constructor.name, "initialCommandFilters", tweeningSize)
        // reformat to rgb with or without alpha
      assertPopulatedString(filterInput, 'format input')
      const formatFilter = 'format'
      // const formatFilterId = idGenerate(formatFilter)
      const formatCommandFilter: CommandFilter = {
        inputs: [filterInput], ffmpegFilter: formatFilter, 
        options: { pix_fmts: requiresAlpha ? 'rgb24' : 'rgba' },
        outputs: [containerInput]
      }
      commandFilters.push(formatCommandFilter)
    } 
    return commandFilters
  }

  intrinsicRectInitialize(): Rect {
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

  pathElement(rect: Rect, time: Time, range: TimeRange, forecolor = colorWhite): SvgItem {
    const { intrinsicRect, definition } = this
    const { path } = definition
    const transformAttribute = tweenRectScale(intrinsicRect, rect)

    const pathElement = globalThis.document.createElementNS(NamespaceSvg, 'path')
    pathElement.setAttribute('d', path)
    pathElement.setAttribute('fill', forecolor)
    pathElement.setAttribute('transform', transformAttribute)
    pathElement.setAttribute('transform-origin', 'top left')
    return pathElement
  }

  requiresAlpha(args: CommandFileArgs): boolean {
    const { contentColors } = args
    const colorContent = isPopulatedArray(contentColors)
    const tweeningSize = this.isTweeningSize(args)
    if (this.isDefault) {
      if (colorContent) return false // can always make colored boxes

      return tweeningSize // need mask to dynamically crop content
    }
    if (!colorContent) return true // always need to mask content

    return tweeningSize || this.isTweeningColor(args)
  
  }
}



import { ShapeContainer, ShapeContainerDefinition } from "./ShapeContainer"
import { InstanceBase } from "../../Instance/InstanceBase"
import { NamespaceSvg } from "../../Setup/Constants"
import { colorBlack, colorWhite } from "../../Utility/Color"
import { Filter } from "../../Filter/Filter"
import { NumberObject, Rect, SvgContent } from "../../declarations"
import { Dimensions, dimensionsRectTransform } from "../../Setup/Dimensions"
import { CommandFile, CommandFiles, CommandFilters, ContainerCommandFileArgs, ContainerCommandFilterArgs, FilterCommandFilterArgs } from "../../MoveMe"
import { DataType, GraphFileType } from "../../Setup/Enums"
import { ContainerMixin } from "../ContainerMixin"
import { svgGroupElement, svgPolygonElement } from "../../Utility/Svg"
import { filterFromId } from "../../Filter/FilterFactory"
import { assertArray, assertRect, isTimeRange } from "../../Utility/Is"
import { commandFilesInputIndex } from "../../Utility/CommandFiles"
import { arrayLast } from "../../Utility/Array"
import { TweenableMixin } from "../../Mixin/Tweenable/TweenableMixin"
import { PropertyTweenSuffix } from "../../Base/Propertied"
import { tweenColors, tweenRects } from "../../Utility/Tween"
import { propertyInstance } from "../../Setup/Property"

const ShapeContainerWithTweenable = TweenableMixin(InstanceBase)
const ShapeContainerWithContainer = ContainerMixin(ShapeContainerWithTweenable)
export class ShapeContainerClass extends ShapeContainerWithContainer implements ShapeContainer {
  constructor(...args: any[]) {
    super(...args)
    const [object] = args
    this.addProperties(object, propertyInstance({
      tweenable: true, name: 'width', 
      type: DataType.Percent, defaultValue: 1.0, max: 2.0
    }))
    this.addProperties(object, propertyInstance({
      tweenable: true, name: 'height', type: DataType.Percent, 
      defaultValue: 1.0, max: 2.0
    }))
  }

  private _alphamergeFilter?: Filter 
  private get alphamergeFilter() { return this._alphamergeFilter ||= filterFromId('alphamerge') }

  _colorFilter?: Filter
  get colorFilter() { return this._colorFilter ||= filterFromId('color') }

  containerCommandFiles(args: ContainerCommandFileArgs): CommandFiles {
    const commandFiles: CommandFiles = []
    const { definitionId, definition } = this
    if (definitionId === "com.moviemasher.shapecontainer.default") return commandFiles

    const { colors = [], containerRects, time, clipTime, videoRate } = args
    const [colorOrNot, colorEnd] = colors
    const color = colorOrNot || colorWhite
    const backcolor = colorOrNot ? 'none' : colorBlack
    const duration = isTimeRange(time) ? time.lengthSeconds : 0
    assertArray(containerRects, 'containerRects')
    const [rect, rectEnd] = containerRects

    const frames = Math.round(duration / videoRate)
    const doRects = tweenRects(rect, rectEnd, frames)
    const doColors = tweenColors(color, colorEnd, frames)

    const dimensions = this.intrinsicDimensions()
    const { width: inWidth, height: inHeight } = dimensions
    const svgTags = doRects.map((rect, index) => {
      const forecolor = doColors[index] || color
      const { width: outwidth, height: outHeight } = rect
      const transformAttribute = dimensionsRectTransform(dimensions, rect)

      const tags: string[] = []
      tags.push(`<svg viewBox="0 0 ${outwidth} ${outHeight}" xmlns="${NamespaceSvg}">`)
      tags.push(`<g transform="${transformAttribute}" width="${inWidth}" height="${inHeight}" >`)
      tags.push(`<rect width="${inWidth}" height="${inHeight}" fill="${backcolor}"/>`)
      tags.push(`<path d="${this.path}" fill="${forecolor}"/>`)
      tags.push("</g>")
      tags.push("</svg>")
      return tags.join("")
    })
    const commandFile: CommandFile = { 
      type: svgTags.length > 1 ? GraphFileType.SvgSequence : GraphFileType.Svg, 
      file: svgTags.join("\n"), 
      input: true,
      inputId: this.id, definition,
    }
    commandFiles.push(commandFile)
    return commandFiles
  }
  
  containerCommandFilters(args: ContainerCommandFilterArgs): CommandFilters {
    const commandFilters: CommandFilters = [] 
    const { colors = [], containerRects, videoRate, filterInput, commandFiles, time } = args
    let filterOutput = filterInput
    const duration = isTimeRange(time) ? time.lengthSeconds : 0
    const filterCommandFilterArgs: FilterCommandFilterArgs = { videoRate, duration } 

    assertArray(containerRects, 'containerRects')
    const [rect, rectEndOrEmpty = {}] = containerRects
    assertRect(rect)
    const rectEnd = { ...rect, ...rectEndOrEmpty }

    if (this.definitionId === "com.moviemasher.shapecontainer.default") {
      // can just use color filter, with my dimensions
      const { colorFilter } = this
      const [color, colorEnd] = colors
            
      colorFilter.setValue(color || colorWhite, 'color')
      colorFilter.setValue(colorEnd, `color${PropertyTweenSuffix}`)
      colorFilter.setValue(rect.x, 'x')
      colorFilter.setValue(rect.y, 'y')
      colorFilter.setValue(rect.width, 'width')
      colorFilter.setValue(rect.height, 'height')
      
      colorFilter.setValue(rectEnd.x, `x${PropertyTweenSuffix}`)
      colorFilter.setValue(rectEnd.y, `y${PropertyTweenSuffix}`)
      colorFilter.setValue(rectEnd.width, `width${PropertyTweenSuffix}`)
      colorFilter.setValue(rectEnd.height, `height${PropertyTweenSuffix}`)
      commandFilters.push(...colorFilter.commandFilters(filterCommandFilterArgs))
      filterOutput = arrayLast(arrayLast(commandFilters).outputs)
    } else {
      const inputIndex = commandFilesInputIndex(commandFiles, this.id) 
      filterOutput = String(inputIndex)
    }
    if (!colors.length) {
      filterCommandFilterArgs.filterInput = filterOutput
      filterCommandFilterArgs.chainInput = filterInput
      commandFilters.push(...this.alphamergeFilter.commandFilters(filterCommandFilterArgs))
      filterOutput = arrayLast(arrayLast(commandFilters).outputs)
    } 
    const superArgs: ContainerCommandFilterArgs = {
      ...args, filterInput: filterOutput
    }
    commandFilters.push(...super.containerCommandFilters(superArgs))
    return commandFilters
  }

  containerSvg(rect: Rect): SvgContent { 
    return this.pathElement(rect, colorWhite)
    
  }

  declare definition: ShapeContainerDefinition

  intrinsicDimensions(): Dimensions {
    return { width: this.pathWidth, height: this.pathHeight }
  }

  declare path: string

  pathElement(rect: Dimensions, forecolor = colorWhite): SvgContent {
    const intrinsicDimensions = this.intrinsicDimensions()
    // const gElement = svgGroupElement(intrinsicDimensions)
    // gElement.appendChild(svgPolygonElement(intrinsicDimensions))
    const pathElement = globalThis.document.createElementNS(NamespaceSvg, 'path')
    pathElement.setAttribute('d', this.path)
    pathElement.setAttribute('fill', forecolor)
    pathElement.classList.add('shape')

    // gElement.appendChild(pathElement)
    const transformAttribute = dimensionsRectTransform(intrinsicDimensions, rect)
    pathElement.setAttribute('transform', transformAttribute)
    pathElement.setAttribute('transform-origin', 'top left')
    return pathElement
  }

  declare pathHeight: number

  declare pathWidth: number
}



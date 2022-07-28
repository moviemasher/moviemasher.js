import { TextContainer, TextContainerDefinition, TextContainerObject } from "./TextContainer"
import { InstanceBase } from "../../Instance/InstanceBase"
import { NamespaceSvg } from "../../Setup/Constants"
import { Filter } from "../../Filter/Filter"
import { Scalar, SvgItem, UnknownObject, ValueObject } from "../../declarations"
import { isRect, Rect } from "../../Utility/Rect"
import { assertSize, sizesEqual } from "../../Utility/Size"
import { CommandFilterArgs, CommandFilters, FilterCommandFilterArgs, GraphFile, GraphFileArgs, GraphFiles } from "../../MoveMe"
import { GraphFileType, isOrientation, LoadType } from "../../Setup/Enums"
import { ContainerMixin } from "../ContainerMixin"
import { FontDefinition } from "../../Media/Font/Font"
import { Defined } from "../../Base/Defined"
import { stringWidthForFamilyAtHeight } from "../../Utility/String"
import { Property } from "../../Setup/Property"
import { colorBlack, colorWhite } from "../../Utility/Color"
import { filterFromId } from "../../Filter/FilterFactory"
import { TweenableMixin } from "../../Mixin/Tweenable/TweenableMixin"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { assertPopulatedArray, assertPopulatedString, assertTrue, isTimeRange } from "../../Utility/Is"
import { PropertyTweenSuffix } from "../../Base/Propertied"
import { tweenMaxSize, tweenRectScale } from "../../Utility/Tween"
import { PointZero } from "../../Utility/Point"
import { arrayLast } from "../../Utility"


const TextContainerWithTweenable = TweenableMixin(InstanceBase)
const TextContainerWithContainer = ContainerMixin(TextContainerWithTweenable)
export class TextContainerClass extends TextContainerWithContainer implements TextContainer {
  constructor(...args: any[]) {
    super(...args)
    const [object] = args

    const { intrinsic } = object as TextContainerObject
    if (isRect(intrinsic)) this.intrinsicRect = intrinsic
  }

  canColor(args: CommandFilterArgs): boolean { return true }

  canColorTween(args: CommandFilterArgs): boolean { return true }

  private _colorFilter?: Filter
  get colorFilter() { return this._colorFilter ||= filterFromId('color')}

  containerSvgItem(rect: Rect, time: Time, range: TimeRange): SvgItem { 
    return this.pathElement(rect, time, range) 
  }

  declare definition: TextContainerDefinition

  definitionIds(): string[] { return [...super.definitionIds(), this.fontId] }

  _font?: FontDefinition
  get font() { return this._font ||= Defined.fromId(this.fontId) as FontDefinition }

  declare fontId: string

  graphFiles(args: GraphFileArgs): GraphFiles {
    const { visible, editing } = args
    if (!visible) return []

    const { string } = this
    // console.trace(this.constructor.name, "graphFiles", visible, editing)

    const graphFiles = this.font.graphFiles(args)
    if (!editing) {
      const textGraphFile: GraphFile = {
        definition: this.font, type: GraphFileType.Txt, file: string
      }
      graphFiles.push(textGraphFile)
    }
    return graphFiles
  }

  initialCommandFilters(args: CommandFilterArgs): CommandFilters {
    const commandFilters: CommandFilters = [] 
    const { visible} = args
    if (!visible) return commandFilters

    const { 
      contentColors: colors = [], outputSize: outputSize, track, filterInput: input,
      containerRects, videoRate, commandFiles, time
    } = args
  
    const duration = isTimeRange(time) ? time.lengthSeconds : 0
    
    assertPopulatedArray(containerRects)
    assertSize(outputSize)
    
    let filterInput = input
    let colorInput = ''
    if (filterInput) {
      commandFilters.push(this.copyCommandFilter(filterInput, track))
    }

    const merging = filterInput && !sizesEqual(...containerRects)

    const [rect, rectEnd] = containerRects
    const { height, width } = rect
    const [color = colorWhite, colorEnd] = colors
    assertPopulatedString(color)

    // console.log(this.constructor.name, "initialCommandFilters", ...containerRects)

    if (merging) {
      const maxSize = tweenMaxSize(...containerRects) 
      const colorArgs: CommandFilterArgs = { 
        ...args, contentColors: [colorBlack, colorBlack], 
        outputSize: maxSize
      }
      commandFilters.push(...this.colorBackCommandFilters(colorArgs))
      colorInput = arrayLast(arrayLast(commandFilters).outputs) 
    }

  
    const textFile = commandFiles.find(commandFile => (
      commandFile.inputId === this.id && commandFile.type === GraphFileType.Txt
    ))
    assertTrue(textFile, 'text file') 
    const { resolved: textfile } = textFile
    assertPopulatedString(textfile, 'textfile')

    const fontFile = commandFiles.find(commandFile => (
      commandFile.inputId === this.id && commandFile.type === LoadType.Font
    ))
    assertTrue(fontFile, 'font file') 
    
    const { resolved: fontfile } = fontFile
    assertPopulatedString(fontfile, 'fontfile')

    const { textFilter, intrinsicRect, lock } = this
    const x = intrinsicRect.x * (width / intrinsicRect.width)
    const y = intrinsicRect.y * (height / intrinsicRect.height)

    const options: ValueObject = { x, y, width, height, color, textfile, fontfile }
    textFilter.setValues(options)
    
    const xEnd = intrinsicRect.x * (rectEnd.width / intrinsicRect.width)
  const yEnd = intrinsicRect.y * (rectEnd.height / intrinsicRect.height)

    textFilter.setValue(!isOrientation(lock), 'stretch')
    textFilter.setValue(intrinsicRect.height, 'intrinsicHeight')
    textFilter.setValue(intrinsicRect.width, 'intrinsicWidth')
    textFilter.setValue(xEnd, `x${PropertyTweenSuffix}`)
    textFilter.setValue(yEnd, `y${PropertyTweenSuffix}`)
    textFilter.setValue(colorEnd, `color${PropertyTweenSuffix}`)
    textFilter.setValue(rectEnd.height, `height${PropertyTweenSuffix}`)
    textFilter.setValue(rectEnd.width, `width${PropertyTweenSuffix}`)
  
    const textArgs: FilterCommandFilterArgs = {
      dimensions: outputSize, videoRate, duration, filterInput
    }
    commandFilters.push(...this.textFilter.commandFilters(textArgs))
    
    if (merging) {
      filterInput = arrayLast(arrayLast(commandFilters).outputs)
      const overlayArgs: CommandFilterArgs = { 
        ...args, filterInput, chainInput: colorInput, 
      }
      commandFilters.push(...this.mergeCommandFilters(overlayArgs))
    }
    return commandFilters
  }

  intrinsicRectInitialize(): Rect {
    const { family } = this.font
    assertPopulatedString(family)

    const clipString = this.string

    const height = 1000
    const dimensions = { width: 0, height, ...PointZero }
    
    if (!clipString) return dimensions

    const [width, x, y] = stringWidthForFamilyAtHeight(clipString, family, height)
    dimensions.width = width
    dimensions.x = x
    dimensions.y = y
    return dimensions
  }

  get intrinsicsKnown(): boolean { 
    return isRect(this._intrinsicRect) 
  }

  pathElement(rect: Rect, time: Time, range: TimeRange, forecolor = colorWhite): SvgItem {
    const { string, font, intrinsicRect } = this
    const { x: inX, y: inY, width: inWidth, height: inHeight } = intrinsicRect
    const { x, y, width: outWidth, height: outHeight } = rect
    const xOffset = inX * (outHeight / inHeight)
    const yOffset = inY * (outWidth / inWidth)
    const { width, height } = rect
    const size = { width, height }
    const offset = { ...size, x: x + xOffset, y: y + yOffset }
    const { family } = font    
    const textElement = globalThis.document.createElementNS(NamespaceSvg, 'text')

    textElement.setAttribute('font-family', family)
    textElement.setAttribute('fill', forecolor)
    textElement.setAttribute('font-size', String(inHeight))
    textElement.setAttribute('dominant-baseline', 'hanging')
    textElement.append(`${string}  `)
    const transformAttribute = tweenRectScale(intrinsicRect, offset)
    textElement.setAttribute('transform', transformAttribute)
    textElement.setAttribute('transform-origin', 'top left')
    return textElement
  }

  private _setptsFilter?: Filter
  get setptsFilter() { return this._setptsFilter ||= filterFromId('setpts')}

  setValue(value: Scalar, name: string, property?: Property): void {
    super.setValue(value, name, property)
    if (property) return

    switch (name) {
      case 'fontId':
        // console.log(this.constructor.name, "setValue deleting font because", name, "changed")
        delete this._font
        delete this._intrinsicRect
        break
      // case 'height':
      // case 'width':
      // case 'lock':
      case 'string':
        delete this._intrinsicRect
        break
    }
  }

  declare string: string

  private _textFilter?: Filter
  get textFilter() { return this._textFilter ||= filterFromId('text')}

  toJSON(): UnknownObject {
    const json = super.toJSON()
    json.intrinsic = this.intrinsicRect
    
    return json
  }
}

import { TextContainer, TextContainerDefinition, TextContainerObject } from "./TextContainer"
import { InstanceBase } from "../../Instance/InstanceBase"
import { NamespaceSvg } from "../../Setup/Constants"
import { Filter } from "../../Filter/Filter"
import { Rect, Scalar, SvgContent, UnknownObject, ValueObject } from "../../declarations"
import { Dimensions, dimensionsTransformToRect } from "../../Setup/Dimensions"
import { CommandFilter, CommandFilters, ContainerCommandFilterArgs, FilterCommandFilterArgs, GraphFile, GraphFileArgs, GraphFiles } from "../../MoveMe"
import { DataType, GraphFileType } from "../../Setup/Enums"
import { ContainerMixin } from "../ContainerMixin"
import { FontDefinition } from "../../Media/Font/Font"
import { Defined } from "../../Base/Defined"
import { stringWidthForFamilyAtHeight } from "../../Utility/String"
import { Property, propertyInstance } from "../../Setup/Property"
import { colorWhite } from "../../Utility/Color"
import { filterFromId } from "../../Filter/FilterFactory"
import { TweenableMixin } from "../../Mixin/Tweenable/TweenableMixin"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { assertDimensions, assertPopulatedArray, assertPopulatedString, assertPositive, assertRect, isAboveZero, isDefined, isDimensions, isNumber, isRect } from "../../Utility/Is"
import { idGenerate } from "../../Utility/Id"
import { Errors } from "../../Setup/Errors"
import { arrayLast } from "../../Utility/Array"
import { PropertyTweenSuffix } from "../../Base/Propertied"
import { fontDefault } from "../../Media/Font/FontFactory"


const TextContainerWithTweenable = TweenableMixin(InstanceBase)
const TextContainerWithContainer = ContainerMixin(TextContainerWithTweenable)
export class TextContainerClass extends TextContainerWithContainer implements TextContainer {
  constructor(...args: any[]) {
    super(...args)
    const [object] = args

    this.addProperties(object, propertyInstance({
      custom: true, type: DataType.String, defaultValue: 'Text'
    }))
    this.addProperties(object, propertyInstance({
      custom: true, type: DataType.FontId, name: 'fontId', defaultValue: fontDefault.id
    }))
    this.addProperties(object, propertyInstance({
      custom: true, type: DataType.Number, name: 'height', defaultValue: 0.3, step: 0.01
    }))

    const { intrinsicOffset } = object as TextContainerObject
    if (isNumber(intrinsicOffset)) this._intrinsicOffset = intrinsicOffset
  }

  containerRects(outputDimensions: Dimensions, time: Time, timeRange: TimeRange, forFiles = false): Rect[] {
    const rects: Rect[] = []
    const [x, xEnd] = this.tweenValues('x', time, timeRange)
    const [y, yEnd] = this.tweenValues('y', time, timeRange)
  
    const height = this.value('height')
    assertPositive(height)

    const inDimensions = forFiles ? outputDimensions : this.intrinsicDimensions()
    const { width: inWidth, height: inHeight } = inDimensions
    const { width: outWidth, height: outHeight } = outputDimensions
   
    const width = ((inWidth / inHeight) * (outHeight * height)) / outWidth
    // console.log(this.constructor.name, "containerRects width", width, "=", "((", inWidth, "/",  inHeight, ") * (", outHeight, "*", height, ")) /",  outWidth)
    const scaleRect = { x, y, width, height }
    rects.push(dimensionsTransformToRect(outputDimensions, scaleRect, this.constrainWidth, this.constrainHeight))
    if (isDefined(xEnd) || isDefined(yEnd)) {
      const tweenRect = { ...scaleRect, x: xEnd, y: yEnd }
      assertRect(tweenRect)
      rects.push(dimensionsTransformToRect(outputDimensions, tweenRect, this.constrainWidth, this.constrainHeight))
    }
    return rects
  }

  containerCommandFilters(args: ContainerCommandFilterArgs): CommandFilters {
    const commandFilters: CommandFilters = []
    const { chainInput, outputDimensions: dimensions, colors = [], containerRects, videoRate, filterInput: input, commandFiles } = args
    assertPopulatedArray(containerRects)
    assertDimensions(dimensions)
    let filterInput = input
    // console.log(this.constructor.name, "rects", containerRects)
    // console.log(this.constructor.name, "colors", colors)
    const [rect, rectEnd] = containerRects
    const [color] = colors

    const { height } = rect
    const textFile = commandFiles.find(commandFile => {
      const { inputId, type } = commandFile
      return inputId === this.id && type === GraphFileType.Txt
    })
    if (!textFile) throw new Error(Errors.internal + 'text file')
    const { resolved } = textFile
    assertPopulatedString(resolved, textFile.definition.id)

    const fontcolor = color || colorWhite
    assertPopulatedString(fontcolor)

    const options: ValueObject = { 
      fontsize: height, fontcolor,
      textfile: resolved, fontfile: this.font.urlAbsolute,
      x: rect.x, y: rect.y, 
    }
    if (isRect(rectEnd)) {
      options[`x${PropertyTweenSuffix}`] = rectEnd.x
      options[`y${PropertyTweenSuffix}`] = rectEnd.y
    }
    this.textFilter.setValues(options)
    const textArgs: FilterCommandFilterArgs = {
      dimensions, filterInput, videoRate, duration: 0
    }

    commandFilters.push(...this.textFilter.commandFilters(textArgs))
    filterInput = arrayLast(arrayLast(commandFilters).outputs)

    const opacityFilters = this.opacityCommandFilters({ ...args, filterInput })
    if (opacityFilters.length) {
      commandFilters.push(...opacityFilters)
      filterInput = arrayLast(arrayLast(opacityFilters).outputs)
    }
  
    const mode = this.value('mode')
    const useBlend = isAboveZero(mode)
    const filter = useBlend ? this.blendFilter : this.overlayFilter
    if (useBlend) filter.setValue(mode, 'mode')
    filter.setValue(0, 'x')
    filter.setValue(0, 'y')
    const filterCommandFilterArgs: FilterCommandFilterArgs = {
      chainInput, dimensions, filterInput, videoRate, duration: 0
    }
    commandFilters.push(...filter.commandFilters(filterCommandFilterArgs))
    return commandFilters
  }

  private _colorFilter?: Filter
  get colorFilter() { return this._colorFilter ||= filterFromId('color')}


  containerSvg(rect: Rect): SvgContent { return this.pathElement(rect) }

  declare definition: TextContainerDefinition

  definitionIds(): string[] { return [...super.definitionIds(), this.fontId] }

  _font?: FontDefinition
  get font() { return this._font ||= Defined.fromId(this.fontId) as FontDefinition }

  declare fontId: string

  graphFiles(args: GraphFileArgs): GraphFiles {
    // console.trace(this.constructor.name, "graphFiles")
    const { visible, editing } = args
    if (!visible) return []

    const graphFiles = this.font.graphFiles(args)
    if (!editing) {
      const textGraphFile: GraphFile = {
        definition: this.font, type: GraphFileType.Txt, file: this.string
      }
      graphFiles.push(textGraphFile)
    }
    return graphFiles
  }

  private _intrinsicOffset = 0

  protected get intrinsicDimensionsInitialize() {
    const { family } = this.font
    assertPopulatedString(family)

    const clipString = this.string

    const height = 100
    const dimensions = { width: 0, height }
    this._intrinsicOffset = 0
    if (!clipString) return dimensions

    const [width, offset] = stringWidthForFamilyAtHeight(clipString, family, height)
    dimensions.width = width
    this._intrinsicOffset = offset
    return dimensions
  }

  get instrinsicsKnown(): boolean { 
    return isDimensions(this._intrinsicDimensions) 
  }

  pathElement(rect: Rect, forecolor = colorWhite): SvgContent {
    const { string, font, _intrinsicOffset: offset } = this
    const { x, y, height } = rect
    const { family } = font
    const textElement = globalThis.document.createElementNS(NamespaceSvg, 'text')
    textElement.setAttribute('x', String(offset + x))
    textElement.setAttribute('y', String(y))
    textElement.setAttribute('font-family', family)
    textElement.setAttribute('fill', forecolor)
    textElement.setAttribute('font-size', String(height))
    textElement.setAttribute('dominant-baseline', 'hanging')
    textElement.classList.add('shape')
    textElement.append(string)
    return textElement
  }

  private _setptsFilter?: Filter
  get setptsFilter() { return this._setptsFilter ||= filterFromId('setpts')}

  setValue(value: Scalar, name: string, property?: Property): void {
    super.setValue(value, name, property)
    switch (name) {
      case 'fontId':
        // console.log(this.constructor.name, "setValue deleting font because", name, "changed")
        if (!property) delete this._font
      case 'height':
      case 'string':
        // console.log(this.constructor.name, "setValue deleting intrinsicDimensions because", name, "changed")
        if (!property) delete this._intrinsicDimensions
    }
  }

  declare string: string

  private _textFilter?: Filter
  get textFilter() { return this._textFilter ||= filterFromId('text')}

  toJSON(): UnknownObject {
    const json = super.toJSON()
    json.intrinsicOffset = this._intrinsicOffset
    return json
  }
}

import { TextContainer, TextContainerDefinition, TextContainerObject } from "./TextContainer"
import { InstanceBase } from "../../Instance/InstanceBase"
import { NamespaceSvg } from "../../Setup/Constants"
import { Filter } from "../../Filter/Filter"
import { Scalar, SvgContent, UnknownObject, ValueObject } from "../../declarations"
import { isRect, Rect, RectTuple } from "../../Utility/Rect"
import { Size, isSize, assertSize } from "../../Utility/Size"
import { CommandFilterArgs, CommandFilters, FilterCommandFilterArgs, GraphFile, GraphFileArgs, GraphFiles } from "../../MoveMe"
import { DataType, GraphFileType, LoadType } from "../../Setup/Enums"
import { ContainerMixin } from "../ContainerMixin"
import { FontDefinition } from "../../Media/Font/Font"
import { Defined } from "../../Base/Defined"
import { stringWidthForFamilyAtHeight } from "../../Utility/String"
import { Property, propertyInstance } from "../../Setup/Property"
import { colorBlack, colorWhite } from "../../Utility/Color"
import { filterFromId } from "../../Filter/FilterFactory"
import { TweenableMixin } from "../../Mixin/Tweenable/TweenableMixin"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { assertNumber, assertPopulatedArray, assertPopulatedString, assertPositive, assertTrue, isDefined, isNumber, isTimeRange } from "../../Utility/Is"
import { PropertyTweenSuffix } from "../../Base/Propertied"
import { fontDefault } from "../../Media/Font/FontFactory"
import { tweenMaxSize, tweenOverRect, tweenScaleSizeToRect, tweenSizesEqual } from "../../Utility/Tween"
import { pointsEqual, PointZero } from "../../Utility/Point"
import { arrayLast } from "../../Utility"


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
      tweenable: true, custom: true, type: DataType.Percent, name: 'height', defaultValue: 0.3, max: 2.0
    }))

    const { intrinsicOffset } = object as TextContainerObject
    if (isNumber(intrinsicOffset)) this._intrinsicOffset = intrinsicOffset

    // console.log(this.constructor.name, this.height, object)
  }


  canColor(args: CommandFilterArgs): boolean { return true }

  canColorTween(args: CommandFilterArgs): boolean { return true }
  
  // containerCommandFilters(args: CommandFilterArgs): CommandFilters {
  //   const commandFilters: CommandFilters = [] 
  //   const { visible, containerRects, time, videoRate, filterInput: input } = args
  //   if (!visible) return commandFilters
    
  //   let filterInput = input
  //   assertPopulatedString(filterInput)
  //   assertPopulatedArray(containerRects, 'containerRects')
  //   const maxSize = tweenMaxSize(...containerRects) 
  //   const duration = isTimeRange(time) ? time.lengthSeconds : 0

  //   const cropArgs: FilterCommandFilterArgs = { 
  //     duration, videoRate, filterInput
  //   }
  //   const { cropFilter } = this
  //   cropFilter.setValue(maxSize.width, "width")
  //   cropFilter.setValue(maxSize.height, "height")
  //   cropFilter.setValue(0, "x")
  //   cropFilter.setValue(0, "y")
  //   cropFilter.setValue(0, `x${PropertyTweenSuffix}`)
  //   cropFilter.setValue(0, `y${PropertyTweenSuffix}`)
  //   commandFilters.push(...cropFilter.commandFilters(cropArgs))
  //   filterInput = arrayLast(arrayLast(commandFilters).outputs)
  //   commandFilters.push(...super.containerCommandFilters({ ...args, filterInput }))
  //   return commandFilters
  // }

  containerRects(outputSize: Size, time: Time, timeRange: TimeRange, forFiles = false): RectTuple {
    const [point, pointEnd] = this.tweenPoints(time, timeRange)
    const [height, heightEnd] = this.tweenValues('height', time, timeRange)
    assertNumber(height)
    
    
    const { _intrinsicOffset: offset } = this
    const inSize = forFiles ? outputSize : this.intrinsicSize()
    const { width: inWidth, height: inHeight } = inSize
    const { width: outWidth, height: outHeight } = outputSize
    const inRatio = (inWidth + offset) / inHeight
    const width = (inRatio * (outHeight * height)) / outWidth

    const forcedScale = { ...point, width, height }
    const { constrainX, constrainY } = this
    const transformedRect = tweenScaleSizeToRect(outputSize, forcedScale, constrainX, constrainY)

    const tweening = !(height === heightEnd && pointsEqual(point, pointEnd))
    if (!tweening) return [transformedRect, transformedRect]

    const widthEnd = isNumber(heightEnd) ? (inRatio * (outHeight * heightEnd)) / outWidth : undefined

    // console.log(this.constructor.name, "containerRects height, heightEnd", height, heightEnd)
    const tweenRect = tweenOverRect(forcedScale, { ...pointEnd, width: widthEnd, height: isNumber(heightEnd) ? heightEnd : height })
    const tweened = tweenScaleSizeToRect(outputSize, tweenRect, constrainX, constrainY)
    
    const tuple: RectTuple = [transformedRect, tweened]
    // console.log(this.constructor.name, "containerRects", constrainX, constrainY, tuple)
    return tuple
  }


  private _colorFilter?: Filter
  get colorFilter() { return this._colorFilter ||= filterFromId('color')}

  containerSvg(rect: Rect, time: Time, range: TimeRange): SvgContent { 
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
        definition: this.font, type: GraphFileType.Txt, file: `${string}  `
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

    const merging = filterInput && !tweenSizesEqual(...containerRects)

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

    const { textFilter, _intrinsicOffset: offset } = this
    const intrinsicSize = this.intrinsicSize()
    const x = offset * (width / intrinsicSize.width)

    const options: ValueObject = { x, width, height, color, textfile, fontfile }
    textFilter.setValues(options)
    
    const xEnd = offset * (rectEnd.width / intrinsicSize.width)
    textFilter.setValue(xEnd, `x${PropertyTweenSuffix}`)
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

  private _intrinsicOffset = 0

  protected get intrinsicSizeInitialize() {
    const { family } = this.font
    assertPopulatedString(family)

    const clipString = this.string

    const height = 10000
    const dimensions = { width: 0, height }
    this._intrinsicOffset = 0
    if (!clipString) return dimensions

    const [width, offset] = stringWidthForFamilyAtHeight(clipString, family, height)
    dimensions.width = width
    this._intrinsicOffset = offset
    return dimensions
  }

  get instrinsicsKnown(): boolean { 
    return isSize(this._intrinsicSize) 
  }

  pathElement(rect: Rect, time: Time, range: TimeRange, forecolor = colorWhite): SvgContent {
    const { string, font, _intrinsicOffset: offset } = this
    const intrinsicSize = this.intrinsicSize()
    const xOffset = offset * (rect.height / intrinsicSize.height)
    const { x, y, height: fontsize } = rect
    
    const { family } = font


    const textElement = globalThis.document.createElementNS(NamespaceSvg, 'text')
    textElement.setAttribute('x', String(Math.ceil(x + xOffset)))
    textElement.setAttribute('y', String(Math.round(y)))
    textElement.setAttribute('font-family', family)
    textElement.setAttribute('fill', forecolor)
    textElement.setAttribute('font-size', String(fontsize))
    textElement.setAttribute('dominant-baseline', 'hanging')
    textElement.classList.add('shape')
    textElement.append(`${string}   `)
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
        // console.log(this.constructor.name, "setValue deleting intrinsicSize because", name, "changed")
        if (!property) delete this._intrinsicSize
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

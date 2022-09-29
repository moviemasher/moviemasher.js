import { TextContainer, TextContainerDefinition, TextContainerObject } from "./TextContainer"
import { InstanceBase } from "../../Instance/InstanceBase"
import { NamespaceSvg } from "../../Setup/Constants"
import { Filter } from "../../Filter/Filter"
import { Scalar, ScalarObject, SvgItem, UnknownObject } from "../../declarations"
import { isRect, Rect } from "../../Utility/Rect"
import { CommandFile, CommandFiles, CommandFilterArgs, CommandFilters, FilterCommandFilterArgs, GraphFileArgs, GraphFiles, VisibleCommandFileArgs, VisibleCommandFilterArgs } from "../../MoveMe"
import { GraphFileType, isOrientation, LoadType } from "../../Setup/Enums"
import { ContainerMixin } from "../ContainerMixin"
import { FontDefinition } from "../../Media/Font/Font"
import { Defined } from "../../Base/Defined"
import { stringFamilySizeRect } from "../../Utility/String"
import { Property } from "../../Setup/Property"
import { colorBlack, colorBlackTransparent, colorWhite } from "../../Utility/Color"
import { filterFromId } from "../../Filter/FilterFactory"
import { TweenableMixin } from "../../Mixin/Tweenable/TweenableMixin"
import { assertPopulatedString, assertTrue } from "../../Utility/Is"
import { PropertyTweenSuffix } from "../../Base/Propertied"
import { Tweening, tweenMaxSize } from "../../Utility/Tween"
import { PointZero } from "../../Utility/Point"
import { arrayLast } from "../../Utility/Array"
import { IntrinsicOptions } from "../../Edited/Mash/Track/Clip/Clip"
import { svgSetTransformRects } from "../../Utility/Svg"


const TextContainerWithTweenable = TweenableMixin(InstanceBase)
const TextContainerWithContainer = ContainerMixin(TextContainerWithTweenable)
export class TextContainerClass extends TextContainerWithContainer implements TextContainer {
  constructor(...args: any[]) {
    const [object] = args
    object.lock ||= ''
    super(...args)

    const { intrinsic } = object as TextContainerObject
    if (isRect(intrinsic)) this._intrinsicRect = intrinsic
  }

  canColor(args: CommandFilterArgs): boolean { return true }

  canColorTween(args: CommandFilterArgs): boolean { return true }

  private _colorFilter?: Filter
  get colorFilter() { return this._colorFilter ||= filterFromId('color')}

  visibleCommandFiles(args: VisibleCommandFileArgs): CommandFiles {
    const files = super.visibleCommandFiles(args)
    const { string } = this
    const textGraphFile: CommandFile = {
      definition: this.font, type: GraphFileType.Txt, 
      file: this.id, content: string, inputId: this.id,
    }
    files.push(textGraphFile)
    return files
  }
  declare definition: TextContainerDefinition

  definitionIds(): string[] { return [...super.definitionIds(), this.fontId] }

  _font?: FontDefinition
  get font() { return this._font ||= Defined.fromId(this.fontId) as FontDefinition }

  declare fontId: string

  fileUrls(args: GraphFileArgs): GraphFiles { return this.font.fileUrls(args) }

  hasIntrinsicSizing = true

  initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
    const commandFilters: CommandFilters = [] 
    const { 
      contentColors: colors = [], outputSize, track, filterInput: input,
      containerRects, videoRate, commandFiles, duration
    } = args
  
    let filterInput = input
    // console.log(this.constructor.name, "initialCommandFilters", filterInput, tweening)

    if (filterInput) {
      commandFilters.push(this.copyCommandFilter(filterInput, track))
    }

    const [rect, rectEnd] = containerRects
    const { height, width } = rect
 
    // console.log(this.constructor.name, "initialCommandFilters", merging, ...containerRects)
    const maxSize = tweenMaxSize(...containerRects) 

    let colorInput = ''
    const merging = !!filterInput || tweening.size
    if (merging) {
      const backColor = filterInput ? colorBlack : colorBlackTransparent
      const colorArgs: VisibleCommandFilterArgs = { 
        ...args, 
        contentColors: [backColor, backColor], 
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

    const { textFilter, lock } = this
    const intrinsicRect = this.intrinsicRect()
    const x = intrinsicRect.x * (rect.width / intrinsicRect.width)
    const y = 0 // intrinsicRect.y * (height / intrinsicRect.height)
    const [color = colorWhite, colorEnd] = colors
    assertPopulatedString(color)

    const xEnd = intrinsicRect.x * (rectEnd.width / intrinsicRect.width)
    const yEnd = 0 // intrinsicRect.y * (rectEnd.height / intrinsicRect.height)
    // console.log(this.constructor.name, "initialCommandFilters", lock)
    const intrinsicRatio = 1000 / intrinsicRect.height
    const textSize = Math.round(height * intrinsicRatio)
    const textSizeEnd = Math.round(rectEnd.height * intrinsicRatio)
    const options: ScalarObject = { 
      x, y, width, height: textSize, color, textfile, fontfile,
      stretch: !isOrientation(lock),
      intrinsicHeight: intrinsicRect.height,
      intrinsicWidth: intrinsicRect.width,
      [`x${PropertyTweenSuffix}`]: xEnd,
      [`y${PropertyTweenSuffix}`]: yEnd,
      [`color${PropertyTweenSuffix}`]: colorEnd,
      [`height${PropertyTweenSuffix}`]: textSizeEnd,
      [`width${PropertyTweenSuffix}`]: rectEnd.width,
    }
    textFilter.setValues(options)
    // console.log(this.constructor.name, "initialCommandFilters", options)

    const textArgs: FilterCommandFilterArgs = {
      dimensions: outputSize, videoRate, duration, filterInput
    }
    commandFilters.push(...textFilter.commandFilters(textArgs))
    
    if (merging) {
      filterInput = arrayLast(arrayLast(commandFilters).outputs)
      assertPopulatedString(filterInput, 'overlay filterInput')
      commandFilters.push(...this.overlayCommandFilters(colorInput, filterInput))

      filterInput = arrayLast(arrayLast(commandFilters).outputs) 
      assertPopulatedString(filterInput, 'crop filterInput')

      const cropArgs: FilterCommandFilterArgs = { 
        duration: 0, videoRate, filterInput
      }
      const { cropFilter } = this
      cropFilter.setValue(maxSize.width, "width")
      cropFilter.setValue(maxSize.height, "height")
      cropFilter.setValue(0, "x")
      cropFilter.setValue(0, "y")
      commandFilters.push(...cropFilter.commandFilters(cropArgs))
    } 
    return commandFilters
  }

  protected _intrinsicRect?: Rect

  intrinsicRect(_ = false): Rect { 
    return this._intrinsicRect ||= this.intrinsicRectInitialize()
  }

  private intrinsicRectInitialize(): Rect {
    const { family } = this.font
    assertPopulatedString(family)

    const clipString = this.string
    const height = 1000
    const dimensions = { width: 0, height, ...PointZero }
    if (!clipString) return dimensions

    const rect = stringFamilySizeRect(clipString, family, height)
    // console.log(this.constructor.name, "intrinsicRectInitialize", rect)
    return rect
  }

  intrinsicsKnown(options: IntrinsicOptions): boolean { 
    const { size } = options
    if (!size) return true

    return isRect(this._intrinsicRect) || !!this.font?.family
  }

  pathElement(rect: Rect): SvgItem {
    const { string, font } = this
    const { family } = font    
    const svgItem = globalThis.document.createElementNS(NamespaceSvg, 'text')
    svgItem.setAttribute('font-family', family)
    svgItem.setAttribute('font-size', String(1000))
    svgItem.append(string)
    svgSetTransformRects(svgItem, this.intrinsicRect(true), rect)
    return svgItem
  }

  setValue(value: Scalar, name: string, property?: Property): void {
    super.setValue(value, name, property)
    if (property) return

    switch (name) {
      case 'fontId':
        delete this._font
        delete this._intrinsicRect
        break
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
    json.intrinsic = this.intrinsicRect(true)
    return json
  }
}

import { TextContainer, TextContainerDefinition, TextContainerObject } from "./TextContainer"
import { InstanceBase } from "../../Instance/InstanceBase"
import { NamespaceSvg } from "../../Setup/Constants"
import { Filter } from "../../Filter/Filter"
import { Scalar, ScalarObject, SvgItem, UnknownObject } from "../../declarations"
import { isRect, Rect } from "../../Utility/Rect"
import { CommandFilterArgs, CommandFilters, FilterCommandFilterArgs, GraphFile, GraphFileArgs, GraphFiles, VisibleCommandFilterArgs } from "../../MoveMe"
import { GraphFileType, isOrientation, LoadType } from "../../Setup/Enums"
import { ContainerMixin } from "../ContainerMixin"
import { FontDefinition } from "../../Media/Font/Font"
import { Defined } from "../../Base/Defined"
import { stringWidthForFamilyAtHeight } from "../../Utility/String"
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

    const files = this.font.graphFiles(args)
    if (!editing) {
      const textGraphFile: GraphFile = {
        definition: this.font, type: GraphFileType.Txt, 
        file: this.id, content: string
      }
      files.push(textGraphFile)
    }
    return files
  }

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
    const x = intrinsicRect.x * (width / intrinsicRect.width)
    const y = intrinsicRect.y * (height / intrinsicRect.height)
    const [color = colorWhite, colorEnd] = colors
    assertPopulatedString(color)

    const xEnd = intrinsicRect.x * (rectEnd.width / intrinsicRect.width)
    const yEnd = intrinsicRect.y * (rectEnd.height / intrinsicRect.height)
    // console.log(this.constructor.name, "initialCommandFilters", lock)
    const options: ScalarObject = { 
      x, y, width, height, color, textfile, fontfile,
      stretch: !isOrientation(lock),
      intrinsicHeight: intrinsicRect.height,
      intrinsicWidth: intrinsicRect.width,
      [`x${PropertyTweenSuffix}`]: xEnd,
      [`y${PropertyTweenSuffix}`]: yEnd,
      [`color${PropertyTweenSuffix}`]: colorEnd,
      [`height${PropertyTweenSuffix}`]: rectEnd.height,
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
    return this._intrinsicRect || this.intrinsicRectInitialize()
  }

  private intrinsicRectInitialize(): Rect {
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

  intrinsicsKnown(options: IntrinsicOptions): boolean { 
    const { size } = options
    if (!size) return true

    return isRect(this._intrinsicRect) 
  }

  pathElement(rect: Rect): SvgItem {
    const { string, font } = this
    const inRect = this.intrinsicRect(true)
    const { x: inX, y: inY, width: inWidth, height: inHeight } = inRect
    const { x, y, width: outWidth, height: outHeight } = rect
    const xOffset = inX * (outHeight / inHeight)
    const yOffset = inY * (outWidth / inWidth)
    const { width, height } = rect
    const size = { width, height }
    const offset = { ...size, x: x + xOffset, y: y + yOffset }
    const { family } = font    
    const svgItem = globalThis.document.createElementNS(NamespaceSvg, 'text')

    svgItem.setAttribute('font-family', family)
    svgItem.setAttribute('font-size', String(inHeight))
    svgItem.setAttribute('dominant-baseline', 'hanging')
    svgItem.append(`${string}  `)
    svgSetTransformRects(svgItem, inRect, offset)
    return svgItem
  }

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
    json.intrinsic = this.intrinsicRect(true)
    return json
  }
}

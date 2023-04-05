import type { Rect} from '../../Utility/Rect.js'
import type {
  CommandFile, CommandFiles, CommandFilterArgs, CommandFilters, 
  FilterCommandFilterArgs, PreloadArgs, VisibleCommandFileArgs, 
  VisibleCommandFilterArgs
} from '../../Base/Code.js'
import type {Filter} from '../../Plugin/Filter/Filter.js'
import type {Font, FontMedia, FontObject} from './Font.js'
import type {IntrinsicOptions} from '../Mash/Track/Clip/Clip.js'
import type {Property} from '../../Setup/Property.js'
import type {Scalar, ScalarRecord, UnknownRecord} from '../../Types/Core.js'
import type {SvgItem} from '../../Helpers/Svg/Svg.js'
import type {Tweening} from '../../Mixin/Tweenable/Tween.js'

import {arrayLast} from '../../Utility/Array.js'
import {assertPopulatedString, assertTrue} from '../../Utility/Is.js'
import {colorBlack, colorBlackTransparent, colorWhite} from '../../Helpers/Color/ColorConstants.js'
import {ContainerMixin} from '../Container/ContainerMixin.js'
import {filterFromId} from '../../Plugin/Filter/FilterFactory.js'
import {GraphFileType, isOrientation, TypeFont} from '../../Setup/Enums.js'
import {isRect} from '../../Utility/Rect.js'
import {MediaInstanceBase} from '../MediaInstanceBase.js'
import {PointZero} from '../../Utility/Point.js'
import {PropertyTweenSuffix} from '../../Base/Propertied.js'
import {stringFamilySizeRect} from '../../Utility/String.js'
import {svgText, svgTransform} from '../../Helpers/Svg/SvgFunctions.js'
import {TweenableMixin} from '../../Mixin/Tweenable/TweenableMixin.js'
import {tweenMaxSize} from '../../Mixin/Tweenable/Tween.js'

const FontHeight = 1000
const FontContainerWithTweenable = TweenableMixin(MediaInstanceBase)
const FontContainerWithContainer = ContainerMixin(FontContainerWithTweenable)
export class FontClass extends FontContainerWithContainer implements Font {
  constructor(...args: any[]) {
    const [object] = args
    object.lock ||= ''
    super(...args)

    const { intrinsic } = object as FontObject
    if (isRect(intrinsic)) this._intrinsicRect = intrinsic
    
  }

  canColor(args: CommandFilterArgs): boolean { return true }

  canColorTween(args: CommandFilterArgs): boolean { return true }

  private _colorFilter?: Filter
  get colorFilter() { return this._colorFilter ||= filterFromId('color')}

  declare definition: FontMedia

  hasIntrinsicSizing = true

  initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
    const commandFilters: CommandFilters = [] 
    const { 
      contentColors: colors = [], outputSize, track, filterInput: input,
      containerRects, videoRate, commandFiles, duration
    } = args
  
    let filterInput = input
    // console.log(this.constructor.name, 'initialCommandFilters', filterInput, tweening)

    if (filterInput) {
      commandFilters.push(this.copyCommandFilter(filterInput, track))
    }

    const [rect, rectEnd] = containerRects
    const { height, width } = rect
 
    // console.log(this.constructor.name, 'initialCommandFilters', merging, ...containerRects)
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
      commandFile.inputId === this.id && commandFile.type === TypeFont
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
    // console.log(this.constructor.name, 'initialCommandFilters', lock)
    const intrinsicRatio = FontHeight / intrinsicRect.height
    const textSize = Math.round(height * intrinsicRatio)
    const textSizeEnd = Math.round(rectEnd.height * intrinsicRatio)
    const options: ScalarRecord = { 
      x, y, width, height: textSize, color, textfile, fontfile,
      stretch: !isOrientation(lock),
      intrinsicHeight: intrinsicRect.height,
      intrinsicWidth: intrinsicRect.width,
    }
    if (xEnd) options[`x${PropertyTweenSuffix}`] = xEnd
    if (yEnd) options[`y${PropertyTweenSuffix}`] = yEnd
    if (colorEnd) options[`color${PropertyTweenSuffix}`] = colorEnd
    if (textSizeEnd) options[`height${PropertyTweenSuffix}`] = textSizeEnd
    if (rectEnd.width) options[`width${PropertyTweenSuffix}`] = rectEnd.width

    textFilter.setValues(options)
    // console.log(this.constructor.name, 'initialCommandFilters', options)

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
      cropFilter.setValue(maxSize.width, 'width')
      cropFilter.setValue(maxSize.height, 'height')
      cropFilter.setValue(0, 'x')
      cropFilter.setValue(0, 'y')
      commandFilters.push(...cropFilter.commandFilters(cropArgs))
    } 
    return commandFilters
  }

  protected _intrinsicRect?: Rect

  intrinsicRect(_ = false): Rect { 
    return this._intrinsicRect ||= this.intrinsicRectInitialize()
  }

  private intrinsicRectInitialize(): Rect {
    const { family } = this.definition
    assertPopulatedString(family)

    const clipString = this.string
    const height = FontHeight
    const dimensions = { width: 0, height, ...PointZero }
    if (!clipString) return dimensions

    const rect = stringFamilySizeRect(clipString, family, height)
    return rect
  }

  intrinsicsKnown(options: IntrinsicOptions): boolean { 
    const { size } = options
    if (!size || isRect(this._intrinsicRect) || this.definition.family) return true

    return false
  }

  loadPromise(args: PreloadArgs): Promise<void> {
    return this.definition.loadPromise(args)
  }

  pathElement(rect: Rect): SvgItem {
    const { string, definition } = this
    const { family } = definition    
    const transform = svgTransform(this.intrinsicRect(true), rect)
    return svgText(string, family, FontHeight, transform)
  }
  
  setValue(value: Scalar, name: string, property?: Property): void {
    super.setValue(value, name, property)
    if (property) return

    switch (name) {
      case 'string':
        delete this._intrinsicRect
        break
    }
  }

  declare string: string

  private _textFilter?: Filter
  get textFilter() { return this._textFilter ||= filterFromId('text')}

  toJSON(): UnknownRecord {
    const json = super.toJSON()
    json.intrinsic = this.intrinsicRect(true)
    return json
  }

  visibleCommandFiles(args: VisibleCommandFileArgs): CommandFiles {
    const files = super.visibleCommandFiles(args)
    const { string, definition } = this
    const textGraphFile: CommandFile = {
      definition, type: GraphFileType.Txt, 
      file: this.id, inputId: this.id,
      content: string, 
    }
    files.push(textGraphFile)
    return files
  }
}


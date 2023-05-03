import type { Rect} from '../../Utility/Rect.js'
import type {ClientFont} from '../../Helpers/ClientMedia/ClientMedia.js'
import type {Font, FontMedia, FontMediaObject, FontObject} from './Font.js'
import type {GraphFile, PreloadArgs, GraphFiles} from '../../Base/Code.js'
import type {Requestable} from '../../Base/Requestable/Requestable.js'
import type {Size} from '../../Utility/Size.js'
import type {UnknownRecord} from '../../Types/Core.js'

import { sizeCover} from '../../Utility/Size.js'
import {assertEndpoint, endpointUrl} from '../../Helpers/Endpoint/EndpointFunctions.js'
import {assertPopulatedString, isDefiniteError, isPopulatedString, isUndefined} from '../../Utility/Is.js'
import {centerPoint} from '../../Utility/Rect.js'
import {colorCurrent} from '../../Helpers/Color/ColorConstants.js'
import {ContainerDefinitionMixin} from '../Container/ContainerDefinitionMixin.js'
import {DataGroupSize, propertyInstance} from '../../Setup/Property.js'
import {DataTypePercent, DataTypeString, LockHeight, TypeFont} from '../../Setup/Enums.js'
import {Default} from '../../Setup/Default.js'
import {EmptyFunction} from '../../Setup/Constants.js'
import {errorThrow} from '../../Helpers/Error/ErrorFunctions.js'
import {FontClass} from './FontClass.js'
import {isClientFont} from '../../Helpers/ClientMedia/ClientMediaFunctions.js'
import {MediaBase} from '../MediaBase.js'
import {PointZero} from '../../Utility/Point.js'
import {stringFamilySizeRect} from '../../Utility/String.js'
import {svgSvgElement, svgText, svgTransform} from '../../Helpers/Svg/SvgFunctions.js'
import {TweenableDefinitionMixin} from '../../Mixin/Tweenable/TweenableDefinitionMixin.js'


const TextHeight = 1000

const FontContainerDefinitionWithTweenable = TweenableDefinitionMixin(MediaBase)
const FontContainerDefinitionWithContainer = ContainerDefinitionMixin(FontContainerDefinitionWithTweenable)

export class FontMediaClass extends FontContainerDefinitionWithContainer implements FontMedia {
  constructor(object: FontMediaObject) {
    super(object)
    const { string, label, loadedFont } = object
    if (loadedFont) this.loadedFont = loadedFont
    
    this.string = string || label || Default.font.string

    this.properties.push(propertyInstance({
      name: 'string', custom: true, type: DataTypeString, defaultValue: this.string
    }))
    this.properties.push(propertyInstance({
      name: 'height', tweenable: true, custom: true, type: DataTypePercent, 
      defaultValue: 0.3, max: 2.0, group: DataGroupSize
    }))

    this.properties.push(propertyInstance({
      name: 'width', tweenable: true, custom: true, type: DataTypePercent, 
      defaultValue: 0.8, max: 2.0, group: DataGroupSize
    }))
  }

  definitionIcon(size: Size): Promise<SVGSVGElement> | undefined {
    return this.loadFontPromise(this.preferredTranscoding(TypeFont)).then(() => {
      const { string, family } = this
      assertPopulatedString(family)
      assertPopulatedString(string)
      
      const inSize = this.intrinsicRect
      const coverSize = sizeCover(inSize, size, true)
      const outRect = { ...coverSize, ...centerPoint(size, coverSize) }


      const transform = svgTransform(inSize, outRect)
      const textElement = svgText(this.string, family, TextHeight, transform, colorCurrent)
    
      return Promise.resolve(svgSvgElement(size, textElement))
    })
    
  }

  private _family = ''
  get family(): string {
    if (!this._family) {
      const { loadedFont } = this
      if (isClientFont(loadedFont)) {
        const { family } = loadedFont
        if (isPopulatedString(family)) this._family = family
      }
    }
    return this._family
  }

  set family(value: string) { this._family = value }

  graphFiles(args: PreloadArgs): GraphFiles {
    const { visible } = args
    if (!visible) return []
    
    const { request } = this
    const { endpoint } = request
    assertEndpoint(endpoint)
    const file = endpointUrl(endpoint) 


    // const file = editing ? url : source
    const graphFile: GraphFile = {
      type: TypeFont, file, definition: this
    }
    return [graphFile]
  }


  instanceArgs(object?: FontObject): FontObject {
    const textObject = object || {}
    if (isUndefined(textObject.lock)) textObject.lock = LockHeight
    return super.instanceArgs(textObject)
  }

  instanceFromObject(object?: FontObject): Font {
    return new FontClass(this.instanceArgs(object))
  }

  protected _intrinsicRect?: Rect

  private get intrinsicRect(): Rect { 
    return this._intrinsicRect ||= this.intrinsicRectInitialize()
  }

  private intrinsicRectInitialize(): Rect {
    const height = TextHeight
    const dimensions = { width: 0, height, ...PointZero }
    const { family, string } = this

    if (!(isPopulatedString(family) && isPopulatedString(string))) return dimensions

    const rect = stringFamilySizeRect(string, family, height)
    return rect
  }


  isVector = true

  loadFontPromise(transcoding: Requestable): Promise<ClientFont> {
    // console.log(this.constructor.name, 'loadFontPromise', transcoding)
    if (this.loadedFont) return Promise.resolve(this.loadedFont)
    
    const { request } = transcoding
    return this.requestFontPromise(request).then(orError => {
      if (isDefiniteError(orError)) return errorThrow(orError.error)

      const { data: loadedFont } = orError
      // assertClientFont(loadedFont)
      
      this.family = loadedFont.family
      this.loadedFont = loadedFont
      return loadedFont
    })
  } 
  loadPromise(args: PreloadArgs): Promise<void> {
    if (this.family) return Promise.resolve()
    
    const { editing } = args
    const transcoding =  editing ? this.findTranscoding(TypeFont, 'woff', 'woff2') : undefined
    const requestable = transcoding || this
    return this.loadFontPromise(requestable).then(EmptyFunction)
  }
  
  private loadedFont?: ClientFont

  // preloadUrls(args: PreloadArgs): string[] {
  //   const { visible, editing } = args
  //   if (!visible) return []

  //   const { url, source } = this
  //   return [editing ? urlPrependProtocol('font:', url) : source]
  // }
  
  toJSON(): UnknownRecord {
    const { string } = this
    return { ...super.toJSON(), string }
  }
  // source = ''

  string = ''

  type = TypeFont 

  // url = ''
}
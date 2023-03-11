import { UnknownRecord } from "../../Types/Core"
import { ClientFont } from "../../Helpers/ClientMedia/ClientMedia"
import { GraphFile, PreloadArgs, GraphFiles } from "../../Base/Code"
import { DataType, Orientation, FontType } from "../../Setup/Enums"
import { Font, FontMedia, FontMediaObject, FontObject } from "./Font"
import { MediaBase } from "../MediaBase"
import { EmptyFunction } from "../../Setup/Constants"
import { requestFontPromise } from "../../Helpers/Request/RequestFunctions"
import { Size, sizeCover } from "../../Utility/Size"
import { centerPoint, Rect } from "../../Utility/Rect"
import { svgSvgElement, svgText, svgTransform } from "../../Helpers/Svg/SvgFunctions"
import { assertPopulatedString, isDefiniteError, isPopulatedString, isUndefined } from "../../Utility/Is"
import { PointZero } from "../../Utility/Point"
import { stringFamilySizeRect } from "../../Utility/String"
import { FontClass } from "./FontClass"
import { DataGroup, propertyInstance } from "../../Setup/Property"
import { TweenableDefinitionMixin } from "../../Mixin/Tweenable/TweenableDefinitionMixin"
import { ContainerDefinitionMixin } from "../Container/ContainerDefinitionMixin"
import { assertEndpoint, endpointUrl } from "../../Helpers/Endpoint/EndpointFunctions"
import { Requestable } from "../../Base/Requestable/Requestable"
import { Default } from "../../Setup/Default"
import { errorThrow } from "../../Helpers/Error/ErrorFunctions"
import { isClientFont } from "../../Helpers/ClientMedia/ClientMediaFunctions"
import { colorCurrent } from "../../Helpers/Color/ColorConstants"


const TextHeight = 1000

const FontContainerDefinitionWithTweenable = TweenableDefinitionMixin(MediaBase)
const FontContainerDefinitionWithContainer = ContainerDefinitionMixin(FontContainerDefinitionWithTweenable)

export class FontMediaClass extends FontContainerDefinitionWithContainer implements FontMedia {
  constructor(object: FontMediaObject) {
    super(object)
    const { string, label } = object
    this.string = string || label || Default.font.string

    this.properties.push(propertyInstance({
      name: 'string', custom: true, type: DataType.String, defaultValue: this.string
    }))
    this.properties.push(propertyInstance({
      name: 'height', tweenable: true, custom: true, type: DataType.Percent, 
      defaultValue: 0.3, max: 2.0, group: DataGroup.Size
    }))

    this.properties.push(propertyInstance({
      name: 'width', tweenable: true, custom: true, type: DataType.Percent, 
      defaultValue: 0.8, max: 2.0, group: DataGroup.Size
    }))
  }

  definitionIcon(size: Size): Promise<SVGSVGElement> | undefined {
    return this.loadFontPromise(this.preferredTranscoding(FontType)).then(() => {
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
      type: FontType, file, definition: this
    }
    return [graphFile]
  }


  instanceArgs(object?: FontObject): FontObject {
    const textObject = object || {}
    if (isUndefined(textObject.lock)) textObject.lock = Orientation.V
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
    if (this.loadedFont) return Promise.resolve(this.loadedFont)
    
    const { request } = transcoding
    return requestFontPromise(request).then(orError => {
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
    const transcoding =  editing ? this.findTranscoding(FontType, 'woff', 'woff2') : undefined
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

  type = FontType 

  // url = ''
}
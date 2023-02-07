import { LoadedFont, UnknownObject } from "../../declarations"
import { GraphFile, PreloadArgs, GraphFiles } from "../../MoveMe"
import { DataType, DefinitionType, LoadType, Orientation } from "../../Setup/Enums"
import { Font, FontDefinition, FontDefinitionObject, FontObject } from "./Font"
import { MediaBase } from "../MediaBase"
import { EmptyMethod } from "../../Setup/Constants"
import { requestFontPromise } from "../../Utility/Request"
import { Size, sizeCover } from "../../Utility/Size"
import { centerPoint, Rect } from "../../Utility/Rect"
import { svgSvgElement, svgText, svgTransform } from "../../Utility/Svg"
import { CommandProbeData, isLoadedFont } from "../../Loader/Loader"
import { Transcoding } from "../../Transcode/Transcoding/Transcoding"
import { assertPopulatedString, isPopulatedString, isUndefined } from "../../Utility/Is"
import { PointZero } from "../../Utility/Point"
import { stringFamilySizeRect } from "../../Utility/String"
import { FontClass } from "./FontClass"
import { DataGroup, propertyInstance } from "../../Setup/Property"
import { TweenableDefinitionMixin } from "../../Mixin/Tweenable/TweenableDefinitionMixin"
import { ContainerDefinitionMixin } from "../Container/ContainerDefinitionMixin"
import { endpointUrl } from "../../Utility/Endpoint"


const TextHeight = 1000

const FontContainerDefinitionWithTweenable = TweenableDefinitionMixin(MediaBase)
const FontContainerDefinitionWithContainer = ContainerDefinitionMixin(FontContainerDefinitionWithTweenable)

export class FontMediaClass extends FontContainerDefinitionWithContainer implements FontDefinition {
  constructor(object: FontDefinitionObject) {
    super(object)
    const { string } = object
    this.string = string || this.label
    const { loadedMedia, id } = this
    if (isLoadedFont(loadedMedia)) this.loadedFont = loadedMedia

    this.properties.push(propertyInstance({
      name: 'string', custom: true, type: DataType.String, defaultValue: this.string
    }))
    this.properties.push(propertyInstance({
      name: 'fontId', custom: true, type: DataType.FontId,  
      defaultValue: id
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
  // bytes: number = 0
  // mimeType: string = ''
  // info?: CommandProbeData | undefined

  definitionIcon(size: Size): Promise<SVGSVGElement> | undefined {
    return this.loadFontPromise(this.preferredTranscoding(DefinitionType.Font)).then(() => {
      const { string, family } = this
      assertPopulatedString(family)
      assertPopulatedString(string)
      
      const inSize = this.intrinsicRect
      const coverSize = sizeCover(inSize, size, true)
      const outRect = { ...coverSize, ...centerPoint(size, coverSize) }


      const transform = svgTransform(inSize, outRect)
      const textElement = svgText(this.string, family, TextHeight, transform)

      return Promise.resolve(svgSvgElement(size, textElement))
    })
    
  }

  private _family: string = ''
  get family(): string {
    if (!this._family) {
      const { loadedFont } = this
      if (isLoadedFont(loadedFont)) {
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
    const file = endpointUrl(request.endpoint) 


    // const file = editing ? url : source
    const graphFile: GraphFile = {
      type: LoadType.Font, file, definition: this
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
    console.log(this.constructor.name, "intrinsicRectInitialize", rect)
    return rect
  }


  isVector = true

  loadFontPromise(transcoding: Transcoding): Promise<LoadedFont> {
    const { request } = transcoding
    return requestFontPromise(request).then(loadedFont => {
      this.family = loadedFont.family
      this.loadedFont = loadedFont
      return loadedFont
    })
  } 
  loadPromise(args: PreloadArgs): Promise<void> {
    if (this.family) return Promise.resolve()
    
    const { editing } = args
    const transcoding =  editing ? this.findTranscoding(DefinitionType.Font, 'woff', 'woff2') : undefined
    const requestable = transcoding || this
    return this.loadFontPromise(requestable).then(EmptyMethod)
  }
  
  private loadedFont?: LoadedFont

  // preloadUrls(args: PreloadArgs): string[] {
  //   const { visible, editing } = args
  //   if (!visible) return []

  //   const { url, source } = this
  //   return [editing ? urlPrependProtocol('font:', url) : source]
  // }
  
  toJSON(): UnknownObject {
    const { string } = this
    return { ...super.toJSON(), string }
  }
  // source = ''

  string = ''

  type = DefinitionType.Font 

  // url = ''
}

import type {Property, Rect, Scalar, Size, Time} from '@moviemasher/runtime-shared'
import type {
  TextInstance, TextAsset,
  TextInstanceObject
} from '../../Shared/Text/TextTypes.js'

import {assertPopulatedString, isDefiniteError, isPopulatedString} from '../../Shared/SharedGuards.js'
import {svgSvgElement, svgTransform, svgText} from '../../Helpers/Svg/SvgFunctions.js'
import { sizeCover } from "../../Utility/SizeFunctions.js"
import { centerPoint } from "../../Utility/RectFunctions.js"
import { VisibleAssetMixin } from '../../Shared/Visible/VisibleAssetMixin.js'
import { ClientVisibleAssetMixin } from "../Visible/ClientVisibleAssetMixin.js"
import { TextAssetMixin, TextInstanceMixin } from '../../Shared/Text/TextMixins.js'
import { VisibleInstanceMixin } from '../../Shared/Visible/VisibleInstanceMixin.js'
import { ClientVisibleInstanceMixin } from '../Visible/ClientVisibleInstanceMixin.js'
import { ClientInstanceClass } from '../Instance/ClientInstanceClass.js'
import { PointZero } from '../../Utility/PointConstants.js'
import { ClientAsset } from "../ClientTypes.js"
import { AssetCacheArgs, Component } from '../../Base/Code.js'
import { ClientAssetClass } from '../Asset/ClientAssetClass.js'
import { ClientFont } from '../../Helpers/ClientMedia/ClientMedia.js'
import { errorThrow } from '../../Helpers/Error/ErrorFunctions.js'
import { EmptyFunction } from '../../Setup/EmptyFunction.js'
import { TextClientAssetObject } from './TextClientTypes.js'
import { clientMediaFontPromise, isClientFont } from '../../Helpers/ClientMedia/ClientMediaFunctions.js'
import { colorCurrent } from '../../Helpers/Color/ColorConstants.js'
import { TextHeight } from '../../Shared/Text/TextConstants.js'
import { TypeFont } from '../../Setup/EnumConstantsAndFunctions.js'
import { stringFamilySizeRect } from '../../Utility/StringFunctions.js'
import { Transcoding } from '../../Plugin/Transcode/Transcoding/Transcoding.js'
import { SvgItem } from '../../Helpers/Svg/Svg.js'
import { AssetEventDetail } from '../../declarations.js'
import { MovieMasher } from '@moviemasher/runtime-client'
import { isTextAssetObject } from '../../Shared/Text/TextGuards.js'

const WithAsset = VisibleAssetMixin(ClientAssetClass)
const WithClientAsset = ClientVisibleAssetMixin(WithAsset)
const WithTextAsset = TextAssetMixin(WithClientAsset)

export class ClientTextAssetClass extends WithTextAsset implements TextAsset {
  assetCachePromise(args: AssetCacheArgs): Promise<void> {
    const { visible } = args
    const { family } = this
    if (family || !visible) return Promise.resolve()

    const transcoding =  this.findTranscoding(TypeFont, 'woff', 'woff2') 
    return this.loadFontPromise(transcoding).then(EmptyFunction)
  }

  definitionIcon(size: Size): Promise<SVGSVGElement> | undefined {
    return this.loadFontPromise(this.findTranscoding(TypeFont)).then(() => {
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

  get family(): string {
    if (!this._family) {
      const { loadedFont } = this
      if (isClientFont(loadedFont)) {
        const { family } = loadedFont
        if (isPopulatedString(family)) this._family = family
      }
    }
    return super.family
  }

  set family(value: string) { this._family = value }


  initializeProperties(object: TextClientAssetObject): void {
    const { loadedFont } = object
    if (loadedFont) this.loadedFont = loadedFont
    
    super.initializeProperties(object)
  }
  
 
  instanceFromObject(object?: TextInstanceObject): TextInstance {
    const args = this.instanceArgs(object)
    return new ClientTextInstanceClass(args)
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
  
  private loadFontPromise(transcoding?: Transcoding): Promise<ClientFont> {
    // console.log(this.constructor.name, 'loadFontPromise', transcoding)
    if (this.loadedFont) return Promise.resolve(this.loadedFont)
    
    const { request } = transcoding || this
    return clientMediaFontPromise(request).then(orError => {
      if (isDefiniteError(orError)) return errorThrow(orError.error)

      const { data: loadedFont } = orError
      // assertClientFont(loadedFont)
      
      this.family = loadedFont.family
      this.loadedFont = loadedFont
      return loadedFont
    })
  } 

   private loadedFont?: ClientFont
}


// listen for image/text asset event
MovieMasher.addDispatchListener<AssetEventDetail>('asset', event => {
  const { detail } = event
  const { assetObject, asset } = detail
  if (!asset && isTextAssetObject(assetObject)) {
    // console.log('ClientShapeAsset AssetEvent setting asset', assetObject)
    detail.asset = new ClientTextAssetClass(assetObject)
    // console.log('ClientShapeAsset AssetEvent set asset', detail.asset?.label)
    event.stopImmediatePropagation()
  } 
})


const WithInstance = VisibleInstanceMixin(ClientInstanceClass)
const WithClientInstance = ClientVisibleInstanceMixin(WithInstance)
const WithTextInstance = TextInstanceMixin(WithClientInstance)

export class ClientTextInstanceClass extends WithTextInstance implements TextInstance {
  declare asset: TextAsset & ClientAsset
    
    containerSvgItemPromise(containerRect: Rect, time: Time, component: Component): Promise<SvgItem> {
      return Promise.resolve(this.pathElement(containerRect))
    }

    override intrinsicRect(_ = false): Rect { 
      return this.intrinsic ||= this.intrinsicRectInitialize()
    }

    private intrinsicRectInitialize(): Rect {
      const { family } = this.asset
      assertPopulatedString(family)

      const clipString = this.string
      const height = TextHeight
      const dimensions: Rect = { width: 0, height, ...PointZero }
      if (!clipString) return dimensions

      const rect = stringFamilySizeRect(clipString, family, height)
      return rect
    }

    pathElement(rect: Rect): SvgItem {
      const { string, asset: definition } = this
      const { family } = definition    
      const transform = svgTransform(this.intrinsicRect(true), rect)
      return svgText(string, family, TextHeight, transform)
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
}

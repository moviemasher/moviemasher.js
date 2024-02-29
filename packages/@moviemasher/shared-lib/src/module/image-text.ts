import type { AssetCacheArgs, AssetFile, AssetFiles, AssetFunction, CacheArgs, ClientTextAsset, ClientTextInstance, Constrained, ContainerSvgItemArgs, DataOrError, DecodeArgs, InstanceArgs, IntrinsicOptions, JobOptions, MaybeComplexSvgItem, Rect, Resource, ResourceTypes, Scalar, ScalarTuple, ServerVisibleAsset, ServerVisibleInstance, Size, StringDataOrError, SvgStyleElement, SvgVector, TextAsset, TextAssetObject, TextInstance, TextInstanceObject, TextRectArgs, VisibleAsset, VisibleInstance } from '../types.js'

import { ClientInstanceClass } from '../base/client-instance.js'
import { ClientRawAssetClass } from '../base/client-raw-asset.js'
import { ServerAssetClass } from '../base/server-asset.js'
import { ServerInstanceClass } from '../base/server-instance.js'
import { ClientVisibleAssetMixin, ClientVisibleInstanceMixin } from '../mixin/client-visible.js'
import { ServerVisibleAssetMixin, ServerVisibleInstanceMixin } from '../mixin/server-visible.js'
import { VisibleAssetMixin, VisibleInstanceMixin } from '../mixin/visible.js'
import { $ASSET, $CLIENT, $CONTAINER, $CSS, $DECODE, $END, $FONT, $HEIGHT, $IMAGE, $MAINTAIN, $PERCENT, $RECT, $RETRIEVE, $SCAN, $SERVER, $STRING, $TEXT, $TTF, $WIDTH, $WOFF2, CURRENT_COLOR, ERROR, MOVIE_MASHER, RECT_ZERO, SLASH, TEXT_HEIGHT, assertScanning, errorPromise, isAssetObject, isDefiniteError, isScanning, namedError, pathExtension, pathFilename, pathJoin } from '../runtime.js'
import { isAboveZero, isPopulatedString, isUndefined } from '../utility/guard.js'
import { assertDefined, assertPopulatedString, isComplexSvgItem, isDropResource } from '../utility/guards.js'
import { centerPoint, containSize, rectTransformAttribute } from '../utility/rect.js'
import { familyFromCss, requestUrl, urlFromCss, urlName } from '../utility/request.js'
import { svgOpacity, svgSetTransformRects, svgStyle, svgSvgElement, svgText } from '../utility/svg.js'

interface ServerTextAsset extends TextAsset, ServerVisibleAsset {
  assetObject: TextAssetObject
}

interface ServerTextInstance extends TextInstance, ServerVisibleInstance {
  asset: ServerTextAsset
}

const textRect = (args: TextRectArgs): DataOrError<Rect> => {
  const {text: string, family, size: height} = args
  const rect = { ...RECT_ZERO, height }
  if (!(isPopulatedString(string) && isAboveZero(height))) return { data: rect }

  const { window, context } = MOVIE_MASHER
  const canvas = window.document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return namedError(ERROR.Internal, 'context2d')

  ctx.font = `${height}px ${family}`
  const metrics: TextMetrics = ctx.measureText(string)
  const {
    actualBoundingBoxAscent: ascent, actualBoundingBoxDescent: descent, 
    actualBoundingBoxLeft, actualBoundingBoxRight: right,
  } = metrics

  // Assumed bug in canvas on server returns negative actualBoundingBoxLeft!
  // Not sure why they are subtracting x_offset everywhere except this line...
  // https://vscode.dev/github/Automattic/node-canvas/blob/master/src/CanvasRenderingContext2d.cc#L2774
  const left = actualBoundingBoxLeft * (context === $SERVER ? -1 : 1)
  const data = {
    x: left, y: ascent, width: right + left, height: ascent + descent
  }
  // console.log('textRect', ctx.font, data, metrics)
  return { data }
}

export function TextAssetMixin<T extends Constrained<VisibleAsset>>(Base: T):
  T & Constrained<TextAsset> {
  return class extends Base implements TextAsset {
    constructor(...args: any[]) {
      super(...args)
      
      // text asset string property is used for asset icon text
      const label = String(this.value('label') || $STRING)
      this.properties.push(this.propertyInstance({
        targetId: $ASSET, name: $TEXT, type: $STRING, defaultValue: label
      }))
      
    }
    override assetCachePromise(args: AssetCacheArgs): Promise<DataOrError<number>> {
      const { visible } = args
      if (!visible) {
        // console.log(this.constructor.name, 'assetCachePromise NOT CACHING', family, visible)
        return Promise.resolve({ data: 0 })
      }
  
      const result = { data: 1 }
      return this.loadFontPromise(args).then(() => {
        if (this.family) return result
        
        const resource = this.resourceOfType($TTF)
        if (!isDropResource(resource)) return namedError(ERROR.Unavailable, $TTF)

        const { validDirectories } = args
        const jobOptions: JobOptions = { validDirectories }  
        const decodeArgs: DecodeArgs = { resource, type: $SCAN, options: {} }
        return MOVIE_MASHER.promise(decodeArgs, $DECODE, jobOptions).then(orError => {
          if (isDefiniteError(orError)) return orError

          const { data: scanning } = orError
          if (!isScanning(scanning)) return namedError(ERROR.Syntax, $SCAN)

          this.decodings.push(scanning)
          const { family } = scanning.data
          if (!isPopulatedString(family)) return namedError(ERROR.Internal, 'family')

          this._family = family
          return result
        })
      })
    }

    private cssPromise(args: AssetCacheArgs, resource: Resource): Promise<StringDataOrError> {
      const { context } = MOVIE_MASHER
      const { validDirectories } = args
      const jobOptions: JobOptions = { validDirectories }      
      return MOVIE_MASHER.promise(resource, $RETRIEVE, jobOptions).then(cssOrError => {
        if (isDefiniteError(cssOrError)) return cssOrError

        const { response: cssText } = resource.request
        if (!isPopulatedString(cssText)) return errorPromise(ERROR.Unavailable, $CSS)
        
        const url = urlFromCss(cssText)
        if (!isPopulatedString(url)) return errorPromise(ERROR.Url, $CSS)
        if (context === $SERVER) {
          const { family } = this
          if (!family) {
            const cssFamily = familyFromCss(cssText)
            if (!cssFamily) return errorPromise(ERROR.Unimplemented, 'family')
            this._family = cssFamily
          }
        }
        const extension = pathExtension(url)
        const existing = this.resourceOfType(extension)
        if (!existing) {
          const fontResource: Resource = {
            request: { endpoint: url }, type: extension
          }
          this.resources.push(fontResource)
        }
        return this.loadFontPromise(args, true)
      })
    }

    private fontPromise(args: AssetCacheArgs, resource: Resource): Promise<StringDataOrError> {
      const { validDirectories } = args
      const jobOptions: JobOptions = { validDirectories }
      return MOVIE_MASHER.promise(resource, $RETRIEVE, jobOptions)
    }

    private loadFontPromise(args: AssetCacheArgs, noCss?: boolean): Promise<StringDataOrError> {
      const { context } = MOVIE_MASHER
      const types: ResourceTypes = [$TTF]
      if (context === $CLIENT) types.unshift($WOFF2)
      if (!noCss) {
        if (context === $SERVER && !this.family) types.unshift($CSS) 
        else types.push($CSS)
      }
      const resource = this.resourceOfType(...types)
      if (!resource) {
        console.error(this.constructor.name, 'loadFontPromise', 'NO resource', types, noCss, this.assetObject)
        return errorPromise(ERROR.Unavailable, $FONT)
      }
      return resource.type === $CSS ? this.cssPromise(args, resource) : this.fontPromise(args, resource)
    } 

    override canBeContainer = true

    private _family?: string

    get family(): string { 
      return this._family ||= this.familyInitialize
    }

    private get familyInitialize(): string {
      const { context } = MOVIE_MASHER
      if (context === $SERVER) {
        const { decoding } = this
        if (!decoding) return ''

        assertScanning(decoding)
        const { data: { family } } = decoding
        return family || ''
      }
      const resource = this.resourceOfType($WOFF2, $TTF)
      if (!resource) return ''
      
      const { request } = resource
      const family = urlName(requestUrl(request))
      return family
    }

    override instanceArgs(object?: TextInstanceObject): TextInstanceObject & InstanceArgs {
      const textObject = object || {}
      if (isUndefined(textObject.lock)) textObject.lock = $WIDTH
      if (isUndefined(textObject.sizeAspect)) textObject.sizeAspect = $MAINTAIN
      if (isUndefined(textObject.pointAspect)) textObject.pointAspect = $MAINTAIN
      return super.instanceArgs(textObject)
    }

    override hasIntrinsicSizing = true

    override isVector = true
 
    style(prefix?: string): SvgStyleElement {
      const resource = this.resourceOfType($TTF)
      assertDefined(resource, $TTF)
   
      const { family } = this
      assertPopulatedString(family, 'family')

      const { path: requestPath } = resource.request
      assertDefined(requestPath)
      const filename = pathFilename(requestPath)
      const pathOrName = prefix ? pathJoin(prefix, filename) : filename
      return svgStyle(pathOrName, family)
    }

    type = $IMAGE
  }
}

export function TextInstanceMixin<T extends Constrained<VisibleInstance>>(Base: T):
  T & Constrained<TextInstance> {
  return class extends Base implements TextInstance {
    constructor(...args: any[]) {
      const [object] = args
      object.lock ||= ''
      super(...args)
      this.properties.push(this.propertyInstance({
        targetId: $CONTAINER, name: $TEXT, type: $STRING,
        defaultValue: this.asset.value($TEXT),
      }))
      this.properties.push(this.propertyInstance({
        targetId: $CONTAINER, name: $HEIGHT, type: $PERCENT,
        min: 0, max: 2, step: 0.01, defaultValue: 0.3, tweens: true,
      }))
      this.properties.push(this.propertyInstance({
        targetId: $CONTAINER, name: `${$HEIGHT}${$END}`,
        type: $PERCENT, undefinedAllowed: true, tweens: true,
      }))
      this.properties.push(this.propertyInstance({
        targetId: $CONTAINER, name: $WIDTH, type: $PERCENT,
        min: 0, max: 2, step: 0.01, tweens: true,
        defaultValue: 0.8,
      }))
      this.properties.push(this.propertyInstance({
        targetId: $CONTAINER, name: `${$WIDTH}${$END}`,
        min: 0, max: 1, step: 0.01,
        type: $PERCENT, undefinedAllowed: true, tweens: true,
      }))
    }
    declare asset: TextAsset

    override containerSvgItem(args: ContainerSvgItemArgs): DataOrError<MaybeComplexSvgItem> {
      const superItem = super.containerSvgItem(args) // calls svgVector, opacity
      const { context } = MOVIE_MASHER  
      if (context !== $SERVER || isDefiniteError(superItem)) return superItem
      
      // on the server we need to add a style for the text element
      const { data: item } = superItem
      const data = isComplexSvgItem(item) ? item : { svgItem: item }
      data.style = this.asset.style()
      return { data }
    }

    private intrinsic?: Rect

    override get intrinsicRect(): Rect { 
      return this.intrinsic ||= this.intrinsicRectInitialize()
    }
  
    private intrinsicRectInitialize(): Rect {
      const { context } = MOVIE_MASHER
      const text = this.string($TEXT)

      const { asset } = this
      const { family } = asset
      const args: TextRectArgs = { text, family, size: TEXT_HEIGHT }
      if (context === $SERVER) {
        const resource = asset.resourceOfType($TTF)
        assertDefined(resource, $TTF)

        const { path: fontPath } = resource.request
        assertDefined(fontPath)
        
        args.fontPath = fontPath
      }
      const orError = textRect(args)
      if (isDefiniteError(orError)) return RECT_ZERO

      return orError.data
    }

    override intrinsicsKnown(options: IntrinsicOptions): boolean {
      if (!options.size) return true
      
      const { asset } = this
      const { context } = MOVIE_MASHER
      const types: ResourceTypes = [$TTF]
      if (context === $CLIENT) types.push($WOFF2)
      return asset.resourceOfType(...types) !== undefined
    }


    override setValue(id: string, value?: Scalar): ScalarTuple {
      const tuple = super.setValue(id, value)
      const [name] = tuple
      if (name === $TEXT) delete this.intrinsic
      return tuple
    }
    
    override svgVector(rect: Rect, forecolor?: string, opacity?: Scalar): SvgVector {
      const text = this.string($TEXT)
      const { asset, intrinsicRect } = this
      const { family } = asset    
      const vector = svgText(text, forecolor, TEXT_HEIGHT, family)
      svgSetTransformRects(vector, intrinsicRect, rect)
      return svgOpacity(vector, opacity)
    }
  }
}

export class ClientTextAssetClass extends TextAssetMixin(
  ClientVisibleAssetMixin(VisibleAssetMixin(ClientRawAssetClass))
) implements ClientTextAsset {
  override assetIcon(size: Size, _cover?: boolean): Promise<DataOrError<Element>> {
    const args: AssetCacheArgs = { visible: true }
    return this.assetCachePromise(args).then(orError => {
      if (isDefiniteError(orError)) return orError

      const { family, textRect } = this
      const string = this.string($TEXT)
      const containedSize = containSize(textRect, size)
      const outRect = { ...containedSize, ...centerPoint(size, containedSize) }
      const transform = rectTransformAttribute(textRect, outRect)
      const textElement = svgText(string, CURRENT_COLOR, TEXT_HEIGHT, family, transform)
      return { data: svgSvgElement(size, textElement) }
    })
  }

  override instanceFromObject(object?: TextInstanceObject): TextInstance {
    const args = this.instanceArgs(object)
    return new ClientTextInstanceClass(args)
  }

  protected _textRect?: Rect

  private get textRect(): Rect { 
    return this._textRect ||= this.textRectInitialize()
  }

  private textRectInitialize(): Rect {
    const { family } = this
    const text = this.string($TEXT)
    const args: TextRectArgs = { text, family, size: TEXT_HEIGHT }
    const orError = textRect(args)
    if (isDefiniteError(orError)) {
      return RECT_ZERO
    }
    console.debug(this.constructor.name, 'textRectInitialize', orError)

    return orError.data
  }
}

export class ClientTextInstanceClass extends TextInstanceMixin(
  ClientVisibleInstanceMixin(VisibleInstanceMixin(ClientInstanceClass))
) implements ClientTextInstance {
  declare asset: ClientTextAsset
}

export class ServerTextAssetClass extends TextAssetMixin(
  ServerVisibleAssetMixin(VisibleAssetMixin(ServerAssetClass))
) implements ServerTextAsset {
  override assetFiles(args: CacheArgs): AssetFiles {
    const { visible } = args
    if (!visible) return []
    
    const resource = this.resourceOfType($TTF)
    if (!resource) return []

    const { request } = resource
    const { path: file } = request
    assertDefined(file)
    
    const assetFile: AssetFile = { type: $FONT, file, asset: this } // not input
    return [assetFile]
  }

  override instanceFromObject(object?: TextInstanceObject): ServerTextInstance {
    const args = this.instanceArgs(object)
    return new ServerTextInstanceClass(args)
  }
}

export class ServerTextInstanceClass extends TextInstanceMixin(
  ServerVisibleInstanceMixin(VisibleInstanceMixin(ServerInstanceClass))
) implements ServerTextInstance { 
  declare asset: ServerTextAsset
}

export const imageTextAssetFunction: AssetFunction = object => {
  if (!isAssetObject(object, $IMAGE, $TEXT)) {
    return namedError(ERROR.Syntax, [$IMAGE, $TEXT].join(SLASH))
  }
  const { context } = MOVIE_MASHER
  const textClass = context === $CLIENT ? ClientTextAssetClass : ServerTextAssetClass
  return { data: new textClass(object) }
}

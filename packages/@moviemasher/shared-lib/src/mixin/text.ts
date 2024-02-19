import type { MaybeComplexSvgItem, Constrained, ContainerSvgItemArgs, DataOrError, InstanceArgs, IntrinsicOptions, RawAsset, Rect, Scalar, SvgVector, TextAsset, TextAssetObject, TextInstance, TextInstanceObject, UnknownRecord, VisibleAsset, VisibleInstance, ScalarTuple, SvgStyleElement, AssetCacheArgs, Resource, StringDataOrError, ResourceTypes, DecodeArgs, JobOptions, TextRectArgs, ContentInstance, SvgItemsRecord } from '../types.js'

import { $ASSET, $CONTAINER, $END, $FONT, $HEIGHT, $IMAGE, $MAINTAIN, MOVIEMASHER, $PERCENT, $SERVER, $STRING, TEXT_HEIGHT, $WIDTH, isDefiniteError, pathFilename, POINT_ZERO, $WOFF2, $TTF, $CSS, errorPromise, ERROR, pathExtension, $CLIENT, $RETRIEVE, namedError, $SCAN, $DECODE, isScanning, assertScanning, pathJoin, $TEXT, $RECT, RECT_ZERO } from '../runtime.js'
import { isPopulatedString, isUndefined } from '../utility/guard.js'
import { assertDefined, assertPopulatedString, isComplexSvgItem, isDropResource } from '../utility/guards.js'
import { svgAppend, svgGroupElement, svgOpacity, svgPolygonElement, svgSetTransformRects, svgStyle, svgText } from '../utility/svg.js'
import { familyFromCss, requestUrl, urlFromCss, urlName } from '../utility/request.js'


export function TextAssetMixin<T extends Constrained<RawAsset & VisibleAsset>>(Base: T):
  T & Constrained<TextAsset> {
  return class extends Base implements TextAsset {
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
        return MOVIEMASHER.promise($DECODE, decodeArgs, jobOptions).then(orError => {
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
      const { context } = MOVIEMASHER
      const { validDirectories } = args
      const jobOptions: JobOptions = { validDirectories }      
      return MOVIEMASHER.promise($RETRIEVE, resource, jobOptions).then(cssOrError => {
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
          // console.log(this.constructor.name, 'cssPromise PUSH', copyResource(fontResource))
          this.resources.push(fontResource)
        }
        return this.loadFontPromise(args, true)
      })
    }

    private fontPromise(args: AssetCacheArgs, resource: Resource): Promise<StringDataOrError> {
      const { validDirectories } = args
      const jobOptions: JobOptions = { validDirectories }
      return MOVIEMASHER.promise($RETRIEVE, resource, jobOptions)
    }

    private loadFontPromise(args: AssetCacheArgs, noCss?: boolean): Promise<StringDataOrError> {
      const { context } = MOVIEMASHER
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
      const { context } = MOVIEMASHER
      if (context === $SERVER) {
        const { decoding } = this
        if (!decoding) return ''

        assertScanning(decoding)
        const { data: { family } } = decoding
        return family || ''
      }
      const resource = this.resourceOfType($WOFF2, $TTF)
      if (!resource) {
        console.error(this.constructor.name, 'familyInitialize', 'resource', this.resources)
        return ''
      }

      const { request } = resource
      // const { response  } = requestisClientFont(response) ? response.family : 
      const family = urlName(requestUrl(request))
      // console.debug(this.constructor.name, 'familyInitialize', family, copyResource(resource))
      return family
    }

    override initializeProperties(object: TextAssetObject): void {
      const { label } = object
    
      // text asset string property is used for asset icon text
      this.properties.push(this.propertyInstance({
        targetId: $ASSET, name: $STRING, type: $STRING, defaultValue: label
      }))
      super.initializeProperties(object)
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
 
    declare string: string

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
    declare asset: TextAsset

    override containerSvgItem(args: ContainerSvgItemArgs): DataOrError<MaybeComplexSvgItem> {
      const superItem = super.containerSvgItem(args) // calls svgVector, opacity
      const { context } = MOVIEMASHER  
      if (context !== $SERVER || isDefiniteError(superItem)) return superItem
      
      // on the server we need to add a style for the text element
      const { data: item } = superItem
      const data = isComplexSvgItem(item) ? item : { svgItem: item }
      data.style = this.asset.style()
      return { data }
    }
  
    override initializeProperties(object: TextInstanceObject): void {
      object.lock ||= ''
      this.properties.push(this.propertyInstance({
        targetId: $CONTAINER, name: $STRING, type: $STRING,
        defaultValue: this.asset.string,
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
      super.initializeProperties(object)
    }

    intrinsic?: Rect

    override get intrinsicRect(): Rect { 
      return this.intrinsic ||= this.intrinsicRectInitialize()
    }
  
    private intrinsicRectInitialize(): Rect {
      const { context } = MOVIEMASHER
      const { asset, string: text } = this
      const { family } = asset
      const args: TextRectArgs = { text, family, size: TEXT_HEIGHT }
      if (context === $SERVER) {
        const resource = asset.resourceOfType($TTF)
        assertDefined(resource, $TTF)

        const { path: fontPath } = resource.request
        assertDefined(fontPath)
        
        args.fontPath = fontPath
      }
      const orError = MOVIEMASHER.call<Rect>($TEXT, $RECT, args)
      if (isDefiniteError(orError)) return RECT_ZERO

      return orError.data
    }

    
    override intrinsicsKnown(options: IntrinsicOptions): boolean {
      if (!options.size) return true
      
      const { asset } = this
      const { context } = MOVIEMASHER
      const types: ResourceTypes = [$TTF]
      if (context === $CLIENT) types.push($WOFF2)
      return asset.resourceOfType(...types) !== undefined
      // return isRect(this.intrinsicRect) || !!asset.family
    }


    override setValue(id: string, value?: Scalar): ScalarTuple {
      const tuple = super.setValue(id, value)
  
      const [name] = tuple
      switch (name) {
        case 'string': {
          // console.log(this.constructor.name, 'setValue', name, value)
          delete this.intrinsic
          break 
        }
      }
      return tuple
    }

    

    override svgVector(rect: Rect, forecolor?: string, opacity?: Scalar): SvgVector {
      const { string, asset, intrinsicRect } = this
      const { family } = asset    
      const vector = svgText(string, forecolor, TEXT_HEIGHT, family)
      svgSetTransformRects(vector, intrinsicRect, rect)
      return svgOpacity(vector, opacity)
    }

    declare string: string

  }
}
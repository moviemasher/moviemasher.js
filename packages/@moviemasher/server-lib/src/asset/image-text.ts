import type { AssetCacheArgs, CacheArgs, DataOrError, InstanceArgs, ListenersFunction, Rect, TextAssetObject, TextInstanceObject, TextRectArgs } from '@moviemasher/shared-lib/types.js'
import type { ServerTextAsset, ServerTextInstance } from '../type/ServerTypes.js'
import type { AssetFile, AssetFiles, ServerAssetManager } from '../types.js'

import { TextAssetMixin, TextInstanceMixin } from '@moviemasher/shared-lib/mixin/text.js'
import { VisibleAssetMixin, VisibleInstanceMixin } from '@moviemasher/shared-lib/mixin/visible.js'
import { $FONT, $IMAGE, $RECT, $TEXT, $TTF, ERROR, MOVIEMASHER, POINT_ZERO, RECT_ZERO, TEXT_HEIGHT, isAssetObject, isDefiniteError, namedError } from '@moviemasher/shared-lib/runtime.js'
import { assertDefined } from '@moviemasher/shared-lib/utility/guards.js'
import path from 'path'
import { ServerAssetClass } from '../base/asset.js'
import { ServerInstanceClass } from '../base/instance.js'
import { ServerVisibleAssetMixin, ServerVisibleInstanceMixin } from '../mixin/visible.js'
import { ENV, ENV_KEY } from '../utility/env.js'
import { EventServerAsset } from '../utility/events.js'
import { fileCopyPromise } from '../utility/file.js'


const WithAsset = VisibleAssetMixin(ServerAssetClass)
const WithServerAsset = ServerVisibleAssetMixin(WithAsset)
const WithTextAsset = TextAssetMixin(WithServerAsset)
export class ServerTextAssetClass extends WithTextAsset implements ServerTextAsset {
  constructor(args: TextAssetObject, manager?: ServerAssetManager) {
    super(args, manager)
    if (!manager) console.trace('ServerTextAssetClass', this.constructor.name, 'no manager')
    this.initializeProperties(args)
  }

  // override assetCachePromise(args: AssetCacheArgs): Promise<DataOrError<number>> {
  //   const { visible } = args
  //   if (!visible) return Promise.resolve({ data: 0 })

  //   return super.assetCachePromise(args).then(orError => {
  //     if (isDefiniteError(orError)) return orError


  //     const resource = this.resourceOfType($TTF)
  //     if (!resource) return namedError(ERROR.Unavailable, $TTF)

  //     const { path: file } = resource.request
  //     if (!file) return namedError(ERROR.Unavailable, $TTF)

  //     const ttfFile = path.join(ENV.get(ENV_KEY.FontDir), path.basename(file))
  //     console.log(this.constructor.name, 'assetCachePromise', { file, ttfFile })
  //     return fileCopyPromise(file, ttfFile).then(copyOrError => (
  //       isDefiniteError(copyOrError) ? copyOrError : { data: 1 }
  //     ))
  //   })
  // }

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
  
  static handleAsset(event:EventServerAsset) {
    const { detail } = event
    const { assetObject, manager } = detail
    if (!isAssetObject(assetObject, $IMAGE, $TEXT)) return

    detail.asset = new ServerTextAssetClass(assetObject, manager)
    event.stopImmediatePropagation()
  }
}

const WithInstance = VisibleInstanceMixin(ServerInstanceClass)
const WithServerInstance = ServerVisibleInstanceMixin(WithInstance)
const WithTextInstance = TextInstanceMixin(WithServerInstance)
export class ServerTextInstanceClass extends WithTextInstance implements ServerTextInstance { 
  constructor(args: TextInstanceObject & InstanceArgs) {
    super(args)
    this.initializeProperties(args)
  }
  
  // override get intrinsicRect(): Rect { 
  //   return this.intrinsic ||= this.intrinsicRectInitialize()
  // }

  // private intrinsicRectInitialize(): Rect {
  //   const { asset, string: text } = this
    
  //   if (!text) return { width: 0, height: TEXT_HEIGHT, ...POINT_ZERO }

  //   const resource = asset.resourceOfType($TTF)
  //   if (!resource) return RECT_ZERO

  //   const { request } = resource
  //   const { path: fontPath } = request
  //   assertDefined(fontPath)

    
  //   const { family } = asset

  //   const args: TextRectArgs = { text, family, size: TEXT_HEIGHT, fontPath }
  //   const orError = MOVIEMASHER.call<Rect>($TEXT, $RECT, args)
  //   if (isDefiniteError(orError)) return RECT_ZERO

  //   return orError.data
    
  // }

  declare asset: ServerTextAsset
}

// listen for image/text asset event
export const ServerTextImageListeners: ListenersFunction = () => ({
  [EventServerAsset.Type]: ServerTextAssetClass.handleAsset,
})

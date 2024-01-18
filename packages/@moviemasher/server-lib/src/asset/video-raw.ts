import type { AssetFile, AssetFiles } from '../types.js'
import type { InstanceArgs, CacheArgs, RawVideoAssetObject, VideoInstanceObject, ListenersFunction } from '@moviemasher/shared-lib/types.js'
import type { ServerRawVideoAsset, ServerRawVideoInstance } from '../type/ServerTypes.js'

import { EventServerAsset } from '../runtime.js'
import { RAW, AUDIO, VIDEO, isAssetObject } from '@moviemasher/shared-lib/runtime.js'
import { ServerAudibleAssetMixin } from '../mixin/audible.js'
import { ServerAudibleInstanceMixin } from '../mixin/audible.js'
import { ServerRawAssetClass } from '../base/asset-raw.js'
import { ServerInstanceClass } from '../base/instance.js'
import { ServerVisibleAssetMixin } from '../mixin/visible.js'
import { ServerVisibleInstanceMixin } from '../mixin/visible.js'

import { assertPopulatedString } from '@moviemasher/shared-lib/utility/guards.js'
import { AudibleAssetMixin, AudibleInstanceMixin } from '@moviemasher/shared-lib/mixin/audible.js'
import { VisibleAssetMixin, VisibleInstanceMixin } from '@moviemasher/shared-lib/mixin/visible.js'
import { VideoAssetMixin, VideoInstanceMixin } from '@moviemasher/shared-lib/mixin/video.js'

const WithAudibleAsset = AudibleAssetMixin(ServerRawAssetClass)
const WithVisibleAsset = VisibleAssetMixin(WithAudibleAsset)
const WithServerVisibleAsset = ServerVisibleAssetMixin(WithVisibleAsset)
const WithServerAsset = ServerAudibleAssetMixin(WithServerVisibleAsset)
const WithVideoAsset = VideoAssetMixin(WithServerAsset)

export class ServerRawVideoAssetClass extends WithVideoAsset implements ServerRawVideoAsset {
  constructor(args: RawVideoAssetObject) {
    super(args)
    this.initializeProperties(args)
  }
  
  override assetFiles(args: CacheArgs): AssetFiles {
    const { audible, visible } = args
    const files: AssetFiles = []
    const { request } = this
    const { path: file } = request
    assertPopulatedString(file)

    if (visible) {
      const visFile: AssetFile = { type: VIDEO, avType: VIDEO, file, asset: this }
      files.push(visFile)
    }
    if (audible) {
      const mutable = this.duration ? this.canBeMuted : true
      if (mutable && !this.muted) {
        const audFile: AssetFile = { type: AUDIO, avType: AUDIO, file, asset: this }
        files.push(audFile)
      }
    }
    return files
  }


  override instanceFromObject(object?: VideoInstanceObject): ServerRawVideoInstance {
    const args = this.instanceArgs(object)
    return new ServerRawVideoInstanceClass(args)
  }


  type = VIDEO

  static handleAsset(event: EventServerAsset) {
    const { detail } = event
    const { assetObject } = detail
    if (isAssetObject(assetObject, VIDEO, RAW)) {
      detail.asset = new ServerRawVideoAssetClass(assetObject)
      event.stopImmediatePropagation()
    }
  }
}

// listen for video/raw asset event
export const ServerRawVideoListeners: ListenersFunction = () => ({
  [EventServerAsset.Type]: ServerRawVideoAssetClass.handleAsset
})

const WithAudibleInstance = AudibleInstanceMixin(ServerInstanceClass)
const WithVisibleInstance = VisibleInstanceMixin(WithAudibleInstance)
const WithServerVisibleInstanceD = ServerVisibleInstanceMixin(WithVisibleInstance)
const WithServerAudibleInstance = ServerAudibleInstanceMixin(WithServerVisibleInstanceD)
const WithVideoInstance = VideoInstanceMixin(WithServerAudibleInstance)
export class ServerRawVideoInstanceClass extends WithVideoInstance implements ServerRawVideoInstance {  
  constructor(args: VideoInstanceObject & InstanceArgs) {
    super(args)
    this.initializeProperties(args)
  }

  declare asset: ServerRawVideoAsset
}

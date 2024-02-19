import type { CacheArgs, InstanceArgs, ListenersFunction, RawVideoAssetObject, VideoInstanceObject } from '@moviemasher/shared-lib/types.js'
import type { ServerRawVideoAsset, ServerRawVideoInstance } from '../type/ServerTypes.js'
import type { AssetFile, AssetFiles, ServerAssetManager } from '../types.js'

import { AudibleAssetMixin, AudibleInstanceMixin } from '@moviemasher/shared-lib/mixin/audible.js'
import { VideoAssetMixin, VideoInstanceMixin } from '@moviemasher/shared-lib/mixin/video.js'
import { VisibleAssetMixin, VisibleInstanceMixin } from '@moviemasher/shared-lib/mixin/visible.js'
import { $AUDIO, $RAW, $VIDEO, isAssetObject } from '@moviemasher/shared-lib/runtime.js'
import { assertDefined } from '@moviemasher/shared-lib/utility/guards.js'
import { ServerRawAssetClass } from '../base/asset-raw.js'
import { ServerInstanceClass } from '../base/instance.js'
import { ServerAudibleAssetMixin, ServerAudibleInstanceMixin } from '../mixin/audible.js'
import { ServerVisibleAssetMixin, ServerVisibleInstanceMixin } from '../mixin/visible.js'
import { EventServerAsset } from '../utility/events.js'

const WithAudibleAsset = AudibleAssetMixin(ServerRawAssetClass)
const WithVisibleAsset = VisibleAssetMixin(WithAudibleAsset)
const WithServerVisibleAsset = ServerVisibleAssetMixin(WithVisibleAsset)
const WithServerAsset = ServerAudibleAssetMixin(WithServerVisibleAsset)
const WithVideoAsset = VideoAssetMixin(WithServerAsset)

export class ServerRawVideoAssetClass extends WithVideoAsset implements ServerRawVideoAsset {
  constructor(args: RawVideoAssetObject, manager?: ServerAssetManager) {
    super(args, manager)
    this.initializeProperties(args)
  }
  
  override assetFiles(args: CacheArgs): AssetFiles {
    const { audible, visible } = args
    const files: AssetFiles = []
    const { request } = this
    if (!request) return files
    
    const { path: file } = request
    assertDefined(file)

    if (visible) {
      const visFile: AssetFile = { type: $VIDEO, avType: $VIDEO, file, asset: this }
      files.push(visFile)
    }
    if (audible) {
      const mutable = this.duration ? this.canBeMuted : true
      if (mutable && !this.muted) {
        const audFile: AssetFile = { type: $AUDIO, avType: $AUDIO, file, asset: this }
        files.push(audFile)
      }
    }
    return files
  }


  override instanceFromObject(object?: VideoInstanceObject): ServerRawVideoInstance {
    const args = this.instanceArgs(object)
    return new ServerRawVideoInstanceClass(args)
  }

  type = $VIDEO

  static handleAsset(event: EventServerAsset) {
    const { detail } = event
    const { assetObject, manager } = detail
    if (isAssetObject(assetObject, $VIDEO, $RAW)) {
      detail.asset = new ServerRawVideoAssetClass(assetObject, manager)
      event.stopImmediatePropagation()
    }
  }
}

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

// listen for video/raw asset event
export const ServerRawVideoListeners: ListenersFunction = () => ({
  [EventServerAsset.Type]: ServerRawVideoAssetClass.handleAsset
})
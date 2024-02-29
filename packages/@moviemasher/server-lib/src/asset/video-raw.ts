import type {AssetFile, AssetFiles, ServerInstance, AssetFunction, CacheArgs, VideoInstance, VideoInstanceObject } from '@moviemasher/shared-lib/types.js'

import { AudibleAssetMixin, AudibleInstanceMixin } from '@moviemasher/shared-lib/mixin/audible.js'
import { VideoAssetMixin, VideoInstanceMixin } from '@moviemasher/shared-lib/mixin/video.js'
import { VisibleAssetMixin, VisibleInstanceMixin } from '@moviemasher/shared-lib/mixin/visible.js'
import { $AUDIO, $RAW, $VIDEO, ERROR, SLASH, isAssetObject, namedError } from '@moviemasher/shared-lib/runtime.js'
import { assertDefined } from '@moviemasher/shared-lib/utility/guards.js'
import { ServerRawAssetClass } from '@moviemasher/shared-lib/base/server-raw-asset.js'
import { ServerInstanceClass } from '@moviemasher/shared-lib/base/server-instance.js'
import { ServerAudibleAssetMixin, ServerAudibleInstanceMixin } from '@moviemasher/shared-lib/mixin/server-audible.js'
import { ServerVisibleAssetMixin, ServerVisibleInstanceMixin } from '@moviemasher/shared-lib/mixin/server-visible.js'
import { ServerVideoAsset } from '../type/ServerAssetTypes.js'

interface ServerRawVideoAsset extends ServerVideoAsset {}

interface ServerRawVideoInstance extends VideoInstance, ServerInstance {
  asset: ServerRawVideoAsset
}

const WithAudibleAsset = AudibleAssetMixin(ServerRawAssetClass)
const WithVisibleAsset = VisibleAssetMixin(WithAudibleAsset)
const WithServerVisibleAsset = ServerVisibleAssetMixin(WithVisibleAsset)
const WithServerAsset = ServerAudibleAssetMixin(WithServerVisibleAsset)
const WithVideoAsset = VideoAssetMixin(WithServerAsset)

export class ServerRawVideoAssetClass extends WithVideoAsset implements ServerRawVideoAsset {
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
      if (mutable) {
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
}

const WithAudibleInstance = AudibleInstanceMixin(ServerInstanceClass)
const WithVisibleInstance = VisibleInstanceMixin(WithAudibleInstance)
const WithServerVisibleInstanceD = ServerVisibleInstanceMixin(WithVisibleInstance)
const WithServerAudibleInstance = ServerAudibleInstanceMixin(WithServerVisibleInstanceD)
const WithVideoInstance = VideoInstanceMixin(WithServerAudibleInstance)
export class ServerRawVideoInstanceClass extends WithVideoInstance implements ServerRawVideoInstance {  
  declare asset: ServerRawVideoAsset
}

export const serverVideoRawAssetFunction: AssetFunction = (assetObject) => {
  if (!isAssetObject(assetObject, $VIDEO, $RAW)) {
    return namedError(ERROR.Syntax, [$VIDEO, $RAW].join(SLASH))
  }
  return { data: new ServerRawVideoAssetClass(assetObject) }
}
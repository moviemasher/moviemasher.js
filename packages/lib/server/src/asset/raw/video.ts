import type { GraphFile, GraphFiles } from '@moviemasher/runtime-server'
import type { InstanceArgs, CacheArgs, RawVideoAssetObject, VideoInstanceObject, ListenersFunction } from '@moviemasher/runtime-shared'
import type { ServerRawVideoAsset, ServerRawVideoInstance } from '../../Types/ServerRawTypes.js'

import { EventServerAsset } from '@moviemasher/runtime-server'
import { RAW, AUDIO, VIDEO, isAssetObject } from '@moviemasher/runtime-shared'
import { ServerAudibleAssetMixin } from '../../Base/ServerAudibleAssetMixin.js'
import { ServerAudibleInstanceMixin } from '../../Base/ServerAudibleInstanceMixin.js'
import { ServerRawAssetClass } from '../../Base/ServerRawAssetClass.js'
import { ServerInstanceClass } from '../../Base/ServerInstanceClass.js'
import { ServerVisibleAssetMixin } from '../../Base/ServerVisibleAssetMixin.js'
import { ServerVisibleInstanceMixin } from '../../Base/ServerVisibleInstanceMixin.js'
import { AudibleAssetMixin, VideoAssetMixin, VisibleAssetMixin } from '@moviemasher/lib-shared/asset/mixins.js'
import { AudibleInstanceMixin, VideoInstanceMixin, VisibleInstanceMixin } from '@moviemasher/lib-shared/instance/mixins.js'
import { assertPopulatedString } from '@moviemasher/lib-shared/utility/guards.js'

const WithAudibleAsset = AudibleAssetMixin(ServerRawAssetClass)
const WithVisibleAsset = VisibleAssetMixin(WithAudibleAsset)
const WithServerAudibleAsset = ServerAudibleAssetMixin(WithVisibleAsset)
const WithServerVisibleAsset = ServerVisibleAssetMixin(WithServerAudibleAsset)
const WithVideoAsset = VideoAssetMixin(WithServerVisibleAsset)
export class ServerRawVideoAssetClass extends WithVideoAsset implements ServerRawVideoAsset {
  constructor(args: RawVideoAssetObject) {
    super(args)
    this.initializeProperties(args)
  }
  
  assetGraphFiles(args: CacheArgs): GraphFiles {
    const { audible, visible } = args
    const files: GraphFiles = []
    const { request } = this
    const { path: file } = request
    assertPopulatedString(file)

    // console.log(this.constructor.name, 'assetGraphFiles', args, file)
    if (visible) {
      const visibleGraphFile: GraphFile = {
        input: true, type: VIDEO, file, definition: this
      }
      files.push(visibleGraphFile)
    }
    if (audible) {
      const mutable = this.duration ? this.audio : true
      if (mutable && !this.muted) {
        const audioGraphFile: GraphFile = {
          input: true, type: AUDIO, definition: this,
          file,
        }
        files.push(audioGraphFile)
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
const WithServerAudibleInstance = ServerAudibleInstanceMixin(WithVisibleInstance)
const WithServerVisibleInstanceD = ServerVisibleInstanceMixin(WithServerAudibleInstance)
const WithVideoInstance = VideoInstanceMixin(WithServerVisibleInstanceD)

export class ServerRawVideoInstanceClass extends WithVideoInstance implements ServerRawVideoInstance {  
  constructor(args: VideoInstanceObject & InstanceArgs) {
    super(args)
    this.initializeProperties(args)
  }

  declare asset: ServerRawVideoAsset
}

import type { GraphFile, GraphFiles, ServerPromiseArgs } from '@moviemasher/runtime-server'
import type { AssetCacheArgs, InstanceArgs, PreloadArgs, RawVideoAssetObject, VideoInstanceObject } from '@moviemasher/runtime-shared'
import type { ServerRawVideoAsset, ServerRawVideoInstance } from '../../Types/ServerRawTypes.js'

import { AudibleAssetMixin, AudibleInstanceMixin, EmptyFunction, VideoAssetMixin, VideoInstanceMixin, VisibleAssetMixin, VisibleInstanceMixin, assertEndpoint, assertPopulatedString, endpointUrl } from '@moviemasher/lib-shared'
import { EventServerAsset, EventServerAssetPromise, MovieMasher } from '@moviemasher/runtime-server'
import { ERROR, SourceRaw, AUDIO, VIDEO, errorPromise, errorThrow, isAssetObject, isDefiniteError } from '@moviemasher/runtime-shared'
import { ServerAudibleAssetMixin } from '../../Base/ServerAudibleAssetMixin.js'
import { ServerAudibleInstanceMixin } from '../../Base/ServerAudibleInstanceMixin.js'
import { ServerRawAssetClass } from '../../Base/ServerRawAssetClass.js'
import { ServerInstanceClass } from '../../Base/ServerInstanceClass.js'
import { ServerVisibleAssetMixin } from '../../Base/ServerVisibleAssetMixin.js'
import { ServerVisibleInstanceMixin } from '../../Base/ServerVisibleInstanceMixin.js'

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


  graphFiles(args: PreloadArgs): GraphFiles {
    const files: GraphFiles = []

    const { audible, visible } = args

    const { request } = this
    const { path: file } = request

    // const { endpoint } = request
    // assertEndpoint(endpoint)

    // const file = endpointUrl(endpoint)

    assertPopulatedString(file)

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
          file: '',
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
    if (isAssetObject(assetObject, VIDEO, SourceRaw)) {
      detail.asset = new ServerRawVideoAssetClass(assetObject)
      event.stopImmediatePropagation()
    }
  }
}

// listen for video/raw asset event
export const ServerRawVideoListeners = () => ({
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

  serverPromise(args: ServerPromiseArgs): Promise<void> {
    console.log(this.constructor.name, 'serverPromise', args)
    const { asset: definition } = this
    const { audio } = definition
    const { visible } = args
    if (visible || audio) return definition.serverPromise(args)

    return Promise.resolve()
  }
}

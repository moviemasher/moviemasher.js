import { 
  AudibleAssetMixin, ServerRawAssetClass, VisibleAssetMixin, 
  ServerAudibleAssetMixin, ServerVisibleAssetMixin, VideoAssetMixin, 
 assertEndpoint, endpointUrl, assertPopulatedString, 

  AudibleInstanceMixin, ServerInstanceClass, VisibleInstanceMixin, 
  ServerAudibleInstanceMixin, ServerVisibleInstanceMixin, VideoInstanceMixin, 

  ServerRawVideoAsset,
  ServerRawVideoInstance
} from '@moviemasher/lib-shared'
import { GraphFiles, GraphFile, ServerPromiseArgs, EventAsset, MovieMasher } from '@moviemasher/runtime-server'
import { PreloadArgs, TypeVideo, TypeAudio, isAssetObject, SourceRaw } from '@moviemasher/runtime-shared'

const WithAudibleAsset = AudibleAssetMixin(ServerRawAssetClass)
const WithVisibleAsset = VisibleAssetMixin(WithAudibleAsset)
const WithServerAudibleAsset = ServerAudibleAssetMixin(WithVisibleAsset)
const WithServerVisibleAsset = ServerVisibleAssetMixin(WithServerAudibleAsset)
const WithVideoAsset = VideoAssetMixin(WithServerVisibleAsset)
export class ServerRawVideoAssetClass extends WithVideoAsset implements ServerRawVideoAsset {
  graphFiles(args: PreloadArgs): GraphFiles {
    const files: GraphFiles = []

    const { audible, visible } = args

    const { request } = this
    const { endpoint } = request
    assertEndpoint(endpoint)

    const file = endpointUrl(endpoint)

    assertPopulatedString(file)

    if (visible) {
      const visibleGraphFile: GraphFile = {
        input: true, type: TypeVideo, file, definition: this
      }
      files.push(visibleGraphFile)
    }
    if (audible) {
      const mutable = this.duration ? this.audio : true
      if (mutable && !this.muted) {
        const audioGraphFile: GraphFile = {
          input: true, type: TypeAudio, definition: this,
          file: '',
        }
        files.push(audioGraphFile)
      }
    }
    return files
  }

  type = TypeVideo

  static handleAsset(event: EventAsset) {
    const { detail } = event
    const { assetObject } = detail
    if (isAssetObject(assetObject, TypeVideo, SourceRaw)) {
      detail.asset = new ServerRawVideoAssetClass(assetObject)
      event.stopImmediatePropagation()
    }
  }
}

// listen for video/raw asset event
MovieMasher.eventDispatcher.addDispatchListener(
  EventAsset.Type, ServerRawVideoAssetClass.handleAsset
)

const WithAudibleInstance = AudibleInstanceMixin(ServerInstanceClass)
const WithVisibleInstance = VisibleInstanceMixin(WithAudibleInstance)
const WithServerAudibleInstance = ServerAudibleInstanceMixin(WithVisibleInstance)
const WithServerVisibleInstanceD = ServerVisibleInstanceMixin(WithServerAudibleInstance)
const WithVideoInstance = VideoInstanceMixin(WithServerVisibleInstanceD)

export class ServerVideoInstanceClass extends WithVideoInstance implements ServerRawVideoInstance {
  serverPromise(args: ServerPromiseArgs): Promise<void> {
    console.log(this.constructor.name, 'serverPromise', args)
    const { asset: definition } = this
    const { audio } = definition
    const { visible } = args
    if (visible || audio) return definition.serverPromise(args)

    return Promise.resolve()
  }

  declare asset: ServerRawVideoAsset
}

import { AudibleAssetMixin, ServerRawAssetClass, VisibleAssetMixin, ServerAudibleAssetMixin, ServerVisibleAssetMixin, VideoAssetMixin, PreloadArgs, GraphFiles, assertEndpoint, endpointUrl, assertPopulatedString, GraphFile, AudibleInstanceMixin, ServerInstanceClass, VisibleInstanceMixin, ServerAudibleInstanceMixin, ServerVisibleInstanceMixin, VideoInstanceMixin, ServerPromiseArgs } from "@moviemasher/lib-shared"
import { ServerRawVideoAsset, ServerRawVideoInstance } from "@moviemasher/lib-shared/dist/Server/Raw/ServerRawTypes.js"
import { TypeVideo, TypeAudio } from "@moviemasher/runtime-shared"

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
}



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

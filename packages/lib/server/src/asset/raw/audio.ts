import { 
  AudibleAssetMixin, ServerRawAssetClass, ServerAudibleAssetMixin, 
  AudioAssetMixin, AudibleInstanceMixin, ServerInstanceClass, 
  ServerAudibleInstanceMixin, AudioInstanceMixin, ServerRawAudioInstance, ServerRawAudioAsset 
} from "@moviemasher/lib-shared"
import { EventAsset, MovieMasher } from "@moviemasher/runtime-server"
import { SourceRaw, TypeAudio, isAssetObject } from "@moviemasher/runtime-shared"

const WithAudibleAsset = AudibleAssetMixin(ServerRawAssetClass)
const WithServerAudibleAsset = ServerAudibleAssetMixin(WithAudibleAsset)
const WithAudioAsset = AudioAssetMixin(WithServerAudibleAsset)

export class ServerRawAudioAssetClass extends WithAudioAsset implements ServerRawAudioAsset {
  static handleAsset(event: EventAsset) {
    const { detail } = event
    const { assetObject } = detail
    if (isAssetObject(assetObject, TypeAudio, SourceRaw)) {
      detail.asset = new ServerRawAudioAssetClass(assetObject)
      event.stopImmediatePropagation()
    }
  }
}

// listen for audio/raw asset event
MovieMasher.eventDispatcher.addDispatchListener(
  EventAsset.Type, ServerRawAudioAssetClass.handleAsset
)

const WithInstance = AudibleInstanceMixin(ServerInstanceClass)
const WithServerInstance = ServerAudibleInstanceMixin(WithInstance)
const WithAudioInstance = AudioInstanceMixin(WithServerInstance)
export class AudioServerInstanceClass extends WithAudioInstance implements ServerRawAudioInstance {
  declare asset: ServerRawAudioAsset
}

import { 
  AudibleAssetMixin, ServerRawAssetClass, ServerAudibleAssetMixin, 
  AudioAssetMixin, AudibleInstanceMixin, ServerInstanceClass, 
  ServerAudibleInstanceMixin, AudioInstanceMixin, ServerRawAudioInstance, ServerRawAudioAsset 
} from "@moviemasher/lib-shared"

const WithAudibleAsset = AudibleAssetMixin(ServerRawAssetClass)
const WithServerAudibleAsset = ServerAudibleAssetMixin(WithAudibleAsset)
const WithAudioAsset = AudioAssetMixin(WithServerAudibleAsset)

export class ServerRawAudioAssetClass extends WithAudioAsset implements ServerRawAudioAsset {}

const WithInstance = AudibleInstanceMixin(ServerInstanceClass)
const WithServerInstance = ServerAudibleInstanceMixin(WithInstance)
const WithAudioInstance = AudioInstanceMixin(WithServerInstance)
export class AudioServerInstanceClass extends WithAudioInstance implements ServerRawAudioInstance {
  declare asset: ServerRawAudioAsset
}

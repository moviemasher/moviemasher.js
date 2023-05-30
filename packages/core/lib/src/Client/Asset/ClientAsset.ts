
import type { VisibleAsset, AudibleAsset } from '../../Shared/Asset/Asset.js'
import type { ClientAudio, ClientAudioNode, ClientImage, ClientVideo } from '../../Helpers/ClientMedia/ClientMedia.js'
import type { ImportedAssetObject } from '../../Shared/Imported/ImportedTypes.js'
import { ClientAsset } from '../ClientTypes.js'



export interface ImportedClientAssetObject extends ImportedClientAudioAssetObject, ImportedClientImageAssetObject, ImportedClientVideoAssetObject {}

export interface ImportedClientAudioAssetObject extends ImportedAssetObject {
  loadedAudio?: ClientAudio
}

export interface ImportedClientImageAssetObject extends ImportedAssetObject {
  loadedImage?: ClientImage
}

export interface ImportedClientVideoAssetObject extends ImportedAssetObject {
  loadedVideo?: ClientVideo
}

export interface ClientAudibleAsset extends ClientAsset, AudibleAsset {
  audibleSource(): ClientAudioNode | undefined
  
  loadedAudio?: ClientAudio
}

export interface ClientVisibleAsset extends ClientAsset, VisibleAsset {
}

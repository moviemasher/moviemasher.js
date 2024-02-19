import type { AssetObject, AssetResource, RawType, DataOrError, DecodeOptions, Decoding, DecodingType, EncodeOptions, Encoding, EncodingType, EndpointRequest, MashAssetObject, StringDataOrError, TranscodeOptions, Transcoding, TranscodingType } from '@moviemasher/shared-lib/types.js'

import { ServerAsset, ServerAssetManager } from '../types.js'


export interface EventServerManagedAssetDetail {
  assetId: string
  assetObject?: AssetObject
  asset?: ServerAsset
}

export interface EventServerAssetDetail extends EventServerManagedAssetDetail {
  manager: ServerAssetManager
}

export interface EventServerDecodeStatusDetail {
  id: string
  promise?: Promise<DataOrError<Decoding | Date>>
}

export interface EventServerEncodeStatusDetail {
  id: string
  promise?: Promise<DataOrError<Encoding | Date>>
}

export interface EventServerTranscodeStatusDetail {
  id: string
  promise?: Promise<DataOrError<Transcoding | Date>>
}

export interface EventServerDecodeDetail {
  assetType: RawType
  user: string
  id: string
  request: EndpointRequest
  decodingType: DecodingType
  decodeOptions: DecodeOptions
  promise?: Promise<StringDataOrError>
}

export interface EventServerEncodeDetail {
  mashAssetObject: MashAssetObject

  relativeRoot?: string
  user?: string
  id?: string
  encodingType?: EncodingType
  encodeOptions?: EncodeOptions
  promise?: Promise<StringDataOrError>
}

export interface EventServerTranscodeDetail {
  // resource: AssetResource
  assetType: RawType
  request: EndpointRequest
  relativeRoot?: string
  user: string
  id: string
  transcodingType: TranscodingType
  transcodeOptions: TranscodeOptions
  promise?: Promise<StringDataOrError>
}

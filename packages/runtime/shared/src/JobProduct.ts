import type { AssetType } from './AssetType.js'
import type { UnknownRecord } from './Core.js'
import type { Identified } from './Identified.js'
import type { EncodingType, TranscodingType } from './ImportType.js'
import type { MashAssetObject } from './MashTypes.js'
import type { EncodeOptions, TranscodeOptions } from './Output/Output.js'
import type { EndpointRequest } from './Request.js'
import type { RequestObject } from './Requestable.js'
import { Typed } from './Typed.js'

export interface JobProduct extends Typed, Identified {
  createdAt?: string
}

export interface Decoding extends JobProduct {
  type: DecodingType
  data?: UnknownRecord
}

export interface Encoding extends JobProduct, RequestObject {
  type: EncodingType
}

export interface Transcoding extends JobProduct, RequestObject {
  type: TranscodingType 
}


export interface Transcodings extends Array<Transcoding>{}

export interface TranscodeArgs {
  assetType: AssetType
  request: EndpointRequest
  transcodingType: TranscodingType
  options: TranscodeOptions
}
export interface Encodings extends Array<Encoding>{}

export interface EncodeArgs {
  encodingType?: EncodingType
  mashAssetObject: MashAssetObject
  encodeOptions?: EncodeOptions
}
export interface Decodings extends Array<Decoding>{}

export type DecodingType = string | ProbeType

export interface DecodingTypes extends Array<DecodingType>{}

export type ProbeType = 'probe'

export interface DecodeOptions { }

export interface DecodeArgs {
  assetType: AssetType
  request: EndpointRequest
  decodingType: DecodingType
  options: DecodeOptions
}


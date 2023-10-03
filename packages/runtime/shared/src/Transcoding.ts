import type { AssetType } from './AssetType.js'
import type { TranscodingType } from './ImportType.js'
import type { TranscodeOptions } from './Output/Output.js'
import type { EndpointRequest } from './Request.js'
import type { RequestableObject, Requestable } from './Requestable.js'
import type { Typed } from './Typed.js'

export interface TranscodingObject extends RequestableObject, Typed {
  type: TranscodingType 
}

export type TranscodingObjects = TranscodingObject[]

export interface Transcoding extends Requestable {
  type: TranscodingType
}

export type Transcodings = Transcoding[]

export interface TranscodeArgs {
  assetType: AssetType
  request: EndpointRequest
  transcodingType: TranscodingType
  options: TranscodeOptions
}

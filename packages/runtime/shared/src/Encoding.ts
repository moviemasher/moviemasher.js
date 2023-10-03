import type { EncodingType } from './ImportType.js'
import type { MashAssetObject } from './MashTypes.js'
import type { EncodeOptions } from './Output/Output.js'
import type { Requestable, RequestableObject } from './Requestable.js'

export interface Encoding extends Requestable {}
export type Encodings = Encoding[]

export interface EncodingObject extends RequestableObject {
  type: EncodingType
}

export type EncodingObjects = EncodingObject[]

export interface EncodeArgs {
  encodingType?: EncodingType
  mashAssetObject: MashAssetObject
  encodeOptions?: EncodeOptions
}

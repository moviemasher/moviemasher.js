
import type { AssetObject, AssetObjects, Identified, JsonRecord, Labeled, MashAssetObject, Size, StringRecord, UnknownRecord } from '@moviemasher/runtime-shared'
import type { ApiRequest, ApiResponse } from './Api.js'

export interface DescribedObject extends Identified, Labeled, UnknownRecord {}




export interface DataPutResponse extends ApiResponse {
  temporaryIdLookup?: StringRecord
}

export interface DataGetRequest extends ApiRequest, Identified {
}

export interface DataPutRequest extends ApiRequest {
}

export interface DataRetrieveResponse extends ApiResponse {
  described: DescribedObject[]
}

export interface DataServerInit extends JsonRecord {
  temporaryIdPrefix: string
}

export interface DataRetrieve {
  partial?: boolean
}

export interface DataDefinitionPutRequest extends ApiRequest {
  definition: AssetObject
}

export interface DataDefinitionPutResponse extends ApiResponse, Identified {
}

export interface DataDefinitionRetrieveRequest extends ApiRequest, DataRetrieve {
  types: string[]
}

export interface DataDefinitionRetrieveResponse extends ApiResponse {
  definitions: AssetObjects
}

export interface DataDefinitionDeleteRequest extends ApiRequest, Identified {}
export interface DataDefinitionDeleteResponse extends ApiResponse {
  /**
   * If error is defined, a list of mash ids that reference the definition.
   */
  mashIds?: string[]
}


export interface DataMashPutRequest extends DataPutRequest {
  assetIds?: string[]
  mash: MashAssetObject
}
export interface DataMashPutResponse extends DataPutResponse { }

export interface DataMashAndMedia {
  mash: MashAssetObject
}

export interface DataMashRetrieveRequest extends ApiRequest, DataRetrieve { }

export interface DataMashGetResponse extends ApiResponse, DataMashAndMedia { }

export interface DataMashDefaultRequest extends ApiRequest {}
export interface DataMashDefaultResponse extends ApiResponse, DataMashAndMedia {
  previewSize?: Size
}

export interface DataMashDeleteRequest extends ApiRequest, Identified {}
export interface DataMashDeleteResponse extends ApiResponse {
  /**
   * If error is defined, a list of cast ids that reference the mash.
   */
  castIds?: string[]
}

export type DataDefaultRequest = DataMashDefaultRequest 

export type DataDefaultResponse = DataMashDefaultResponse
export interface DataMashGetRequest extends DataGetRequest {}


export interface DataDefinitionGetRequest extends ApiRequest, Identified {}
export interface DataDefinitionGetResponse extends ApiResponse {
  definition?: AssetObject
}

export interface DataMashRetrieveResponse extends DataRetrieveResponse {}


import { 
  JsonObject, AndId, StringObject, StringsObject, DescribedObject 
} from "../declarations"
import { Size } from "../Utility/Size"
import { MashAndMediaObject, MashObject } from "../Edited/Mash/Mash"
import { ApiRequest, ApiResponse } from "./Api"
import { CastObject } from "../Edited/Cast/Cast"
import { StreamObject } from "../Edited/Cast/Stream/Stream"
import { MediaObject, MediaObjects } from "../Media/Media"


export interface DataPutResponse extends ApiResponse {
  temporaryIdLookup?: StringObject
}


export interface DataGetRequest extends ApiRequest, AndId {
}


export interface DataPutRequest extends ApiRequest {
}


export interface DataRetrieveResponse extends ApiResponse {
  described: DescribedObject[]
}

export interface DataServerInit extends JsonObject {
  temporaryIdPrefix: string
}

export interface DataRetrieve {
  partial?: boolean
}

export interface DataDefinitionPutRequest extends ApiRequest {
  definition: MediaObject
}

export interface DataDefinitionPutResponse extends ApiResponse, AndId {
}

export interface DataDefinitionRetrieveRequest extends ApiRequest, DataRetrieve {
  types: string[]
}
export interface DataDefinitionRetrieveResponse extends ApiResponse {
  definitions: MediaObjects
}

export interface DataDefinitionDeleteRequest extends ApiRequest, AndId {}
export interface DataDefinitionDeleteResponse extends ApiResponse {
  /**
   * If error is defined, a list of mash ids that reference the definition.
   */
  mashIds?: string[]
}

// MASH

export interface DataMashPutRequest extends DataPutRequest {
  definitionIds?: string[]
  mash: MashObject
}
export interface DataMashPutResponse extends DataPutResponse { }

export interface DataMashAndMedia {
  mash: MashAndMediaObject
}

export interface DataMashRetrieveRequest extends ApiRequest, DataRetrieve { }

export interface DataMashGetResponse extends ApiResponse, DataMashAndMedia { }

export interface DataMashDefaultRequest extends ApiRequest {}
export interface DataMashDefaultResponse extends ApiResponse, DataMashAndMedia {
  previewSize?: Size
}

export interface DataMashDeleteRequest extends ApiRequest, AndId {}
export interface DataMashDeleteResponse extends ApiResponse {
  /**
   * If error is defined, a list of cast ids that reference the mash.
   */
  castIds?: string[]
}

// CAST
export interface DataCastDefinitions {
  definitions: MediaObjects
}

export interface DataCastRelations {
  cast: CastObject
  definitions: MediaObjects
}
export interface DataCastDefaultRequest extends ApiRequest {}
export type DataDefaultRequest = DataMashDefaultRequest | DataCastDefaultRequest
export interface DataCastDefaultResponse extends ApiResponse, DataCastRelations {
  previewSize?: Size
}
export type DataDefaultResponse = DataMashDefaultResponse | DataCastDefaultResponse
export interface DataCastPutRequest extends DataPutRequest {
  cast: CastObject
  definitionIds: StringsObject
}
export interface DataCastPutResponse extends DataPutResponse {
}

export interface DataCastDeleteRequest extends ApiRequest, AndId {}
export interface DataCastDeleteResponse extends ApiResponse {}

export interface DataCastGetRequest extends DataGetRequest {}
export interface DataMashGetRequest extends DataGetRequest {}

export interface DataStreamGetRequest extends DataGetRequest {}

export interface DataCastGetResponse extends DataCastDefaultResponse {
  previewSize?: Size
}

export interface DataDefinitionGetRequest extends ApiRequest, AndId {}
export interface DataDefinitionGetResponse extends ApiResponse {
  definition: MediaObject
}

export interface DataCastRetrieveRequest extends ApiRequest, DataRetrieve { }

export interface DataMashRetrieveResponse extends DataRetrieveResponse {}
export interface DataCastRetrieveResponse extends DataRetrieveResponse {}

export interface DataStreamRetrieveResponse extends DataRetrieveResponse {}
// STREAM

export interface DataStreamDefinitions {
  stream: StreamObject
  definitions: MediaObjects
}

export interface DataStreamPutRequest extends ApiRequest {
  stream: StreamObject
}

export interface DataStreamPutResponse extends ApiResponse, AndId {
}

export interface DataStreamGetResponse extends ApiResponse, DataStreamDefinitions {
}

export interface DataStreamRetrieveRequest extends ApiRequest, DataRetrieve { }

export interface DataStreamDeleteRequest extends ApiRequest, AndId { }
export interface DataStreamDeleteResponse extends ApiResponse { }

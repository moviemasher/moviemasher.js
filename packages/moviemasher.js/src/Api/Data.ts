import { JsonObject, UploadDescription, AndId, AndType } from "../declarations"
import { DefinitionObject } from "../Base/Definition"
import { MashObject } from "../Edited/Mash/Mash"
import { ApiCallback, ApiRequest, ApiResponse } from "./Api"
import { CastObject } from "../Edited/Cast/Cast"

export interface DataServerInit extends JsonObject {
  uuid: string
}

export interface DataRetrieve {
  partial?: boolean
}

export interface DataDefinitionPutRequest extends ApiRequest, UploadDescription {}


export interface DataDefinitionPutResponse extends ApiResponse {
  id?: string
  fileProperty?: string
  fileCallback?: ApiCallback
  renderingCallback?: ApiCallback
}

export interface DataDefinitionRetrieveRequest extends ApiRequest, AndType, DataRetrieve {}
export interface DataDefinitionRetrieveResponse extends ApiResponse {
  definitions: DefinitionObject[]
}

export interface DataDefinitionDeleteRequest extends ApiRequest, AndId {}
export interface DataDefinitionDeleteResponse extends ApiResponse {
  /**
   * If error is defined, a list of mash ids that reference the definition.
   */
  mashIds?: string[]
}

export interface DataCastRelations {

  mashes: MashObject[]
  definitions: DefinitionObject[]
}
export interface DataCastDefaultRequest extends ApiRequest {}
export interface DataCastDefaultResponse extends ApiResponse, DataCastRelations {
  cast: CastObject
}

export interface DataMashDefaultRequest extends ApiRequest {}
export interface DataMashDefaultResponse extends ApiResponse {
  mash: MashObject
  definitions: DefinitionObject[]
}

export interface DataMashPutRequest extends ApiRequest {
  mash: MashObject
  definitionIds: string[]
}
export interface DataMashPutResponse extends ApiResponse, AndId {}

export interface DataMashDeleteRequest extends ApiRequest, AndId {}
export interface DataMashDeleteResponse extends ApiResponse {
  /**
   * If error is defined, a list of cast ids that reference the mash.
   */
  castIds?: string[]
}

export interface DataCastPutRequest extends ApiRequest {
  mash: CastObject
}
export interface DataCastPutResponse extends ApiResponse, AndId { }

export interface DataCastDeleteRequest extends ApiRequest, AndId {}
export interface DataCastDeleteResponse extends ApiResponse {}

export interface DataMashGetRequest extends ApiRequest, AndId {}
export interface DataMashGetResponse extends DataMashDefaultResponse {}

export interface DataCastGetRequest extends ApiRequest, AndId {}
export interface DataCastGetResponse extends DataCastDefaultResponse {}

export interface DataDefinitionGetRequest extends ApiRequest, AndId {}
export interface DataDefinitionGetResponse extends ApiResponse {
  definition: DefinitionObject
}

export interface DataDefinitionUpdateRequest extends ApiRequest, AndId {
  definition: DefinitionObject
}
export interface DataDefinitionUpdateResponse extends ApiResponse {}

export interface DataMashRetrieveRequest extends ApiRequest, DataRetrieve { }
export interface DataMashRetrieveResponse extends ApiResponse {
  mashes: MashObject[]
}
export interface DataCastRetrieveRequest extends ApiRequest, DataRetrieve { }
export interface DataCastRetrieveResponse extends ApiResponse {
  casts: CastObject[]
}

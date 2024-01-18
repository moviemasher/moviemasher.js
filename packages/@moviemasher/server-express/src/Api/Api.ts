import type { AssetObject, AssetParams, Data, DecodeArgs, DefiniteError, EncodeArgs, EndpointRequest, Identified, TranscodeArgs, Typed } from '@moviemasher/shared-lib/types.js'

export interface ApiRequest {
  [index: string]: any
  version?: string
}
 
export interface VersionResponse {
  version?: string
}

export interface VersionedError extends VersionResponse, DefiniteError {}

export interface VersionedData<T = unknown> extends VersionResponse, Data<T> {}

export type VersionedDataOrError<T = unknown> = VersionedError | VersionedData<T>

export interface StatusRequest extends ApiRequest, Identified {}

export interface DataAssetPutRequest extends ApiRequest {
  assetObject: AssetObject
}

export interface DataAssetListRequest extends ApiRequest, AssetParams {
  partial?: boolean
  order?: string
  descending?: boolean
}


export interface DataAssetDeleteRequest extends ApiRequest, Identified { }

export interface DataAssetDefaultRequest extends ApiRequest { }

export interface DataAssetGetRequest extends ApiRequest, Identified { }

export interface EncodeStartRequest extends ApiRequest, EncodeArgs { }

export interface TranscodeStartRequest extends ApiRequest, TranscodeArgs { }

export interface DecodeStartRequest extends ApiRequest, DecodeArgs { }

export interface UploadFileRequest extends ApiRequest, Identified { }

export interface UploadFileResponse extends Identified { }

export interface UploadRequestRequest extends ApiRequest, Partial<Identified>, Typed {
  name: string
  size: number
}

export interface UploadResponse {
  id: string
  fileProperty?: string
  assetRequest: EndpointRequest
  storeRequest: EndpointRequest
}

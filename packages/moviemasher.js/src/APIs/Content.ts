
import { JsonObject, ServerOptions, StringObject, UploadDescription } from "../declarations"
import { EncodeMashRequest } from "./Encode"

export interface ContentInit extends JsonObject {
  uuid: string
}

/**
 * @category API
 */
export interface ContentGetStoreRequest extends UploadDescription {}

/**
 * @category API
 */
export interface ContentGetStoreResponse {
  server: ServerOptions
  method?: string
  headers?: StringObject
  id: string
}

/**
 * @category API
 */
export interface ContentGetStoredResponse {
  renderRequests: EncodeMashRequest[]
}

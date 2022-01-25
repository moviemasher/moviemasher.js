
import { JsonObject, Segment, AndId, WithError } from "../declarations"
import { OutputObject } from "../Output/Output"
import { EditType } from "../Setup/Enums"
import { JobOptions } from "../Job/Job"

export interface EncodeInit extends JsonObject {}



/**
 * @category API
 */
export interface EncodeMashRequest extends JobOptions {}

/**
 * @category API
 */
export interface EncodeOptionsRequest {
  type: EditType
}

/**
 * @category API
 */
export interface EncodeOptionsResponse extends OutputObject {

}

export interface EncodeStreamResponse extends AndId {
  streamUrl: string
  readySeconds: number
}

export interface EncodeUpdateRequest extends AndId { segment: Segment }

export interface EncodeUpdateResponse extends WithError  {}

import { isRequestable } from "../../../Base/Requestable/RequestableFunctions"
import { isMediaType } from "../../../Setup/MediaType"
import { Transcoding } from "./Transcoding"

export const isTranscoding = (value: any): value is Transcoding => {
  return isRequestable(value) && "type" in value && isMediaType(value.type)
}
import { RenderingCommandOutput } from "../Encode/Encode"
import { isOutput, Output } from "../Base/Code"
import { isTranscodeType, TranscodeType } from "../Setup/Enums"

export interface TranscodeOutput extends Output {
  options: RenderingCommandOutput
  type: TranscodeType
}
export const isTranscodeOutput = (value: any): value is TranscodeOutput => {
  return isOutput(value) && "type" in value && isTranscodeType(value.type)
}


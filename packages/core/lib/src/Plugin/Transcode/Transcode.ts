import { isOutput, Output } from "../../Base/Code"
import { isTyped } from "../../Base/Typed"
import { RenderingCommandOutput } from "../Encode/Encode"
import { TranscodingType } from "./Transcoding/Transcoding"
import { Plugin, TranscodeType } from "../Plugin"

export interface TranscodeOutput extends Output {
  options: RenderingCommandOutput
  type: TranscodingType
  
}
export const isTranscodeOutput = (value: any): value is TranscodeOutput => {
  return isOutput(value) && isTyped(value)
}

export interface TranscoderOptions extends Output {}

export interface FontTranscoderOptions extends TranscoderOptions {}

export interface TranscodePlugin extends Plugin {
  type: TranscodeType

}
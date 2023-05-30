import { RenderingOutput, RenderingOutputArgs } from "../Encode/Encode.js"

export interface ImageSequenceOutputArgs extends RenderingOutputArgs {
}
export interface ImageSequenceOutput extends RenderingOutput { }

export interface WaveformOutputArgs extends RenderingOutputArgs {
  backcolor?: string
  forecolor?: string
}
export interface WaveformOutput extends RenderingOutput { }

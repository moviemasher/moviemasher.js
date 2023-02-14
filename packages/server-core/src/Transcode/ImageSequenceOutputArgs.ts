import { RenderingOutput, RenderingOutputArgs } from "../Encode/Encode";

export interface ImageSequenceOutputArgs extends RenderingOutputArgs {
  cover?: boolean;
}
export interface ImageSequenceOutput extends RenderingOutput { }

export interface WaveformOutputArgs extends RenderingOutputArgs {
  backcolor?: string;
  forecolor?: string;
}
export interface WaveformOutput extends RenderingOutput { }

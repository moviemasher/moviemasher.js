import { ErrorName, errorThrow, isTranscodeOutput, RenderingCommandOutput } from "@moviemasher/moviemasher.js";
import { RenderingOutput } from "../Encode/Encode";
import { isMediaRequest } from "../Media/Media";
import { TranscodeRequest } from "./Transcode";

export const isTranscodeRequest = (value: any): value is TranscodeRequest => {
  return isMediaRequest(value) && "output" in value && isTranscodeOutput(value.output);
};

export function assertTranscodeRequest(value: any): asserts value is TranscodeRequest {
  if (!isTranscodeRequest(value))
    errorThrow(value, 'TranscodeRequest');
}


export const transcodeFileName = (index: number, commandOutput: RenderingCommandOutput, renderingOutput: RenderingOutput): string => {
  const { videoRate } = commandOutput

  if (!videoRate) return errorThrow(ErrorName.Internal)

  const { format, extension, basename = '' } = commandOutput
  const ext = extension || format
  const { duration } = renderingOutput
  const framesMax = Math.floor(videoRate * duration) - 2
  const begin = 1
  const lastFrame = begin + (framesMax - begin)
  const padding = String(lastFrame).length
  return `${basename}%0${padding}d.${ext}`
}
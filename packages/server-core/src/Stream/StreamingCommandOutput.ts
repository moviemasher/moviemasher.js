import { StreamingFormat, Mashes, CommandOutput } from "@moviemasher/moviemasher.js";
import { OutputConstructorArgs, RenderingResult } from "../Encode/Encode";
import { StreamingDescription } from "./Stream";



export interface StreamingCommandOutput extends Required<CommandOutput> {
  streamingFormat: StreamingFormat;
}

export interface StreamingOutputArgs extends OutputConstructorArgs {
  commandOutput: StreamingCommandOutput;
  mashes: Mashes;
}


export interface StreamingOutput {
  streamingDescription(renderingResults?: RenderingResult[]): Promise<StreamingDescription>;
}

export interface VideoStreamOutputArgs extends StreamingOutputArgs { }

export interface VideoStreamOutput extends StreamingOutput { }

import { CommandOutput, StreamingFormat, OutputConstructorArgs, Mashes, RenderingResult, StreamingDescription } from "@moviemasher/moviemasher.js";



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

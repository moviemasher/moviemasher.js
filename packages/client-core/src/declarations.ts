import { DecodeOutput, DefinitionType, TranscodeOutput } from "@moviemasher/moviemasher.js"


export type DecodeTypesByDefinitionType = {
  [index in DefinitionType]?: DecodeOutput[]
}

export type TranscodeTypesByDefinitionType = {
  [index in DefinitionType]?: TranscodeOutput[]
}

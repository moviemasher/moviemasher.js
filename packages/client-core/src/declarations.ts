import { DecodeOutput, MediaType, TranscodeOutput } from "@moviemasher/moviemasher.js"


export type DecodeTypesByMediaType = {
  [index in MediaType]?: DecodeOutput[]
}

export type TranscodeTypesByMediaType = {
  [index in MediaType]?: TranscodeOutput[]
}

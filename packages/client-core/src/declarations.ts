import { DecodeOutput, LoadType, TranscodeOutput } from "@moviemasher/moviemasher.js"


export type DecodeTypesByMediaType = {
  [index in LoadType]?: DecodeOutput[]
}



export type TranscodeTypesByMediaType = {
  [index in LoadType]?: TranscodeOutput[]
}

import { DecodeType } from "@moviemasher/moviemasher.js"
import { Decoder } from "../Decode"


export type DecodersRecord = Record<string | DecodeType, Decoder>
export const Decoders: DecodersRecord = {}

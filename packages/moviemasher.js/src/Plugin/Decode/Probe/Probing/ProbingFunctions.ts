import { errorThrow } from "../../../../Helpers/Error/ErrorFunctions"
import { ProbeType } from "../../Decoding/Decoding"
import { isDecoding } from "../../Decoding/DecodingFunctions"
import { Probing } from "./Probing"

export const isProbing = (value: any): value is Probing => {
  return isDecoding(value) && value.type === ProbeType
}
export  function assertProbing(value: any): asserts value is Probing {
  if (!isProbing(value)) errorThrow(value, 'Probing') 
}
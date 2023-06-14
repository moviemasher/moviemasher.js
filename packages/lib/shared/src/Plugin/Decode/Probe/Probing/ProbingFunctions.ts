import {errorThrow} from '@moviemasher/runtime-shared'
import {TypeProbe} from '@moviemasher/runtime-shared'
import {isDecoding} from '../../Decoding/DecodingFunctions.js'
import {Probing} from './Probing.js'

export const isProbing = (value: any): value is Probing => {
  return isDecoding(value) && value.type === TypeProbe
}
export  function assertProbing(value: any): asserts value is Probing {
  if (!isProbing(value)) errorThrow(value, 'Probing') 
}
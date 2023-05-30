import {errorThrow} from '../../../Helpers/Error/ErrorFunctions.js'
import {isObject} from '../../../Shared/SharedGuards.js'
import {Decoding, isDecodingType} from './Decoding.js'

export const isDecoding = (value: any): value is Decoding => (
  isObject(value) && 'type' in value && isDecodingType(value.type)
)
export function assertDecoding(value: any): asserts value is Decoding {
  if (!isDecoding(value)) errorThrow(value, 'Decoding') 
}


import { isArray, isObject } from "@moviemasher/runtime-shared"
import {errorThrow} from '@moviemasher/runtime-shared'
import {isDecodeOutput} from '../DecodeFunctions.js'
import {ProbeOptions, ProbeOutput} from './Probe.js'


export const isProbeOptions = (value: any): value is ProbeOptions => {
  return isObject(value) && 'types' in value && isArray(value.types)
}
export function assertProbeOptions(value: any): asserts value is ProbeOptions {
  if (!isProbeOptions(value))
    errorThrow(value, 'ProbeOptions')
}

export const isProbeOutput = (value: any): value is ProbeOutput => {
  return isDecodeOutput(value) && 'options' in value && isProbeOptions(value.options)
}
export function assertProbeOutput(value: any): asserts value is ProbeOutput {
  if (!isProbeOutput(value))
    errorThrow(value, 'ProbeOutput')
}

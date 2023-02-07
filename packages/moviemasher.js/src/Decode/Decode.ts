import { isOutput, Output } from "../MoveMe";
import { DecodeType, isDecodeType, ProbeType } from "../Setup/Enums";
import { isArray, isObject } from "../Utility/Is";
import { errorsThrow } from "../Utility/Errors";

export interface DecodeOutput extends Output {
  type: DecodeType
  options?: unknown
}
export const isDecodeOutput = (value: any): value is DecodeOutput => {
  return isOutput(value) && "type" in value && isDecodeType(value.type)
}

export function assertDecodeOutput(value: any): asserts value is DecodeOutput {
  if (!isDecodeOutput(value)) errorsThrow(value, 'DecodeOutput')
}


export interface ProbeOptions {
  types: ProbeType[]
}
export const isProbeOptions = (value: any): value is ProbeOptions => {
  return isObject(value) && "types" in value && isArray(value.types)
}
export function assertProbeOptions(value: any): asserts value is ProbeOptions {
  if (!isProbeOptions(value)) errorsThrow(value, 'ProbeOptions')
}

export interface ProbeOutput extends DecodeOutput {
  options: ProbeOptions
}
export const isProbeOutput = (value: any): value is ProbeOutput => {
  return isDecodeOutput(value) && "options" in value && isProbeOptions(value.options)
}
export function assertProbeOutput(value: any): asserts value is ProbeOutput {
  if (!isProbeOutput(value)) errorsThrow(value, 'ProbeOutput')
}


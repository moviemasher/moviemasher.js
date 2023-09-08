import type { TranscodeOutput } from './TranscodeTypes.js'

import { isOutput, isTranscodingType } from '@moviemasher/lib-shared'
import { isTyped } from '@moviemasher/runtime-shared'

export const isTranscodeOutput = (value: any): value is TranscodeOutput => {
  return isOutput(value) && isTyped(value) && isTranscodingType(value.type)
}

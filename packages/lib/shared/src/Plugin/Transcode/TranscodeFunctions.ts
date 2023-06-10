import type { TranscodeOutput } from './Transcode.js'

import { isOutput } from "../../Base/Output.js"
import { isTyped } from "../../Base/TypedGuards.js"
import { isTranscodingType } from './Transcoding/TranscodingFunctions.js'

export const isTranscodeOutput = (value: any): value is TranscodeOutput => {
  return isOutput(value) && isTyped(value) && isTranscodingType(value.type)
}

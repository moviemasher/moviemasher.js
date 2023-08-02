import { AudioPreview, AudioPreviewArgs } from '@moviemasher/runtime-client'
import { AudioPreviewClass } from './AudioPreviewClass.js'

export const audioPreviewInstance = (args: AudioPreviewArgs): AudioPreview => (
  new AudioPreviewClass(args)
)
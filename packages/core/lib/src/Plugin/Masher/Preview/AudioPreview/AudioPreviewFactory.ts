import { AudioPreview, AudioPreviewArgs } from './AudioPreview.js'
import { AudioPreviewClass } from './AudioPreviewClass.js'

export const audioPreviewInstance = (args: AudioPreviewArgs): AudioPreview => (
  new AudioPreviewClass(args)
)
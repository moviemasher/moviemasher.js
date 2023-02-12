import { AudioPreview, AudioPreviewArgs } from "./AudioPreview";
import { AudioPreviewClass } from "./AudioPreviewClass";

export const audioPreviewInstance = (args: AudioPreviewArgs): AudioPreview => (
  new AudioPreviewClass(args)
)
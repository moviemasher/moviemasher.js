import { OutputType } from "../Setup/Enums"
import { AudioOutputClass } from "./AudioOutputClass"
import { ImageOutputClass } from "./ImageOutputClass"
import { VideoOutputClass } from "./VideoOutputClass"
import { ImageSequenceOutputClass } from "./ImageSequenceOutputClass"
import { WaveformOutputClass } from "./WaveformOutputClass"
import {
  AudioOutputArgs,
  ImageOutputArgs, VideoOutputArgs, ImageSequenceOutputArgs, WaveformOutputArgs
} from "./Output"

export const outputInstanceAudio = (object: AudioOutputArgs) => {
  return new AudioOutputClass(object)
}

export const outputInstanceImage = (object: ImageOutputArgs) => {
  return new ImageOutputClass(object)
}

export const outputInstanceVideo = (object: VideoOutputArgs) => {
  return new VideoOutputClass(object)
}

export const outputInstanceVideoSequence = (object: ImageSequenceOutputArgs) => {
  return new ImageSequenceOutputClass(object)
}

export const outputInstanceWaveform = (object: WaveformOutputArgs) => {
  return new WaveformOutputClass(object)
}

/**
 * @category Factory
 */
export const OutputFactory = {
  [OutputType.Audio]: outputInstanceAudio,
  [OutputType.Image]: outputInstanceImage,
  [OutputType.Video]: outputInstanceVideo,
  [OutputType.ImageSequence]: outputInstanceVideoSequence,
  [OutputType.Waveform]: outputInstanceWaveform,
}

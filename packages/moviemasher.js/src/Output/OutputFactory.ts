import { OutputType } from "../Setup/Enums"
import { AudioOutputClass } from "./AudioOutputClass"
import { ImageOutputClass } from "./ImageOutputClass"
import { VideoOutputClass } from "./VideoOutputClass"
import { ImageSequenceOutputClass } from "./ImageSequenceOutputClass"
import { WaveformOutputClass } from "./WaveformOutputClass"
import {
  AudioOutputArgs,
  ImageOutputArgs,
  VideoOutputArgs,
  ImageSequenceOutputArgs,
  WaveformOutputArgs
} from "./Output"

const outputInstanceAudio = (object: AudioOutputArgs) => {
  return new AudioOutputClass(object)
}

const outputInstanceImage = (object: ImageOutputArgs) => {
  return new ImageOutputClass(object)
}

const outputInstanceVideo = (object: VideoOutputArgs) => {
  return new VideoOutputClass(object)
}

const outputInstanceVideoSequence = (object: ImageSequenceOutputArgs) => {
  return new ImageSequenceOutputClass(object)
}

const outputInstanceWaveform = (object: WaveformOutputArgs) => {
  return new WaveformOutputClass(object)
}

/**
 * @category Factory
 */
const OutputFactory = {
  [OutputType.Audio]: outputInstanceAudio,
  [OutputType.Image]: outputInstanceImage,
  [OutputType.Video]: outputInstanceVideo,
  [OutputType.ImageSequence]: outputInstanceVideoSequence,
  [OutputType.Waveform]: outputInstanceWaveform,
}

export {
  OutputFactory,
  outputInstanceAudio,
  outputInstanceImage,
  outputInstanceVideo,
  outputInstanceVideoSequence,
  outputInstanceWaveform,
}

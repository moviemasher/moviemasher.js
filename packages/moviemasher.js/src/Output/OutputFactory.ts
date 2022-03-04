import { OutputType } from "../Setup/Enums"
import { AudioOutputClass } from "./AudioOutputClass"
import { ImageOutputClass } from "./ImageOutputClass"
import { VideoOutputClass } from "./VideoOutputClass"
import { VideoSequenceOutputClass } from "./VideoSequenceOutputClass"
import { WaveformOutputClass } from "./WaveformOutputClass"
import {
  AudioOutputArgs,
  ImageOutputArgs,
  VideoOutputArgs,
  VideoSequenceOutputArgs,
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

const outputInstanceVideoSequence = (object: VideoSequenceOutputArgs) => {
  return new VideoSequenceOutputClass(object)
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
  [OutputType.VideoSequence]: outputInstanceVideoSequence,
  [OutputType.Waveform]: outputInstanceWaveform,
}

export { OutputFactory }

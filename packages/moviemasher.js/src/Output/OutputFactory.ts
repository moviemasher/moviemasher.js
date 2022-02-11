import { outputDefaultTypeByFormat } from "../Helpers/OutputDefault"
import { OutputType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { AudioOutputClass } from "./AudioOutput"
import { ImageOutputClass } from "./ImageOutput"
import {
  AudioOutput, ImageOutput, Output,
  OutputConstructorArgs, VideoOutput, VideoSequenceOutput, WaveformOutput
} from "./Output"
import { VideoOutputClass } from "./VideoOutput"
import { VideoSequenceOutputClass } from "./VideoSequenceOutput"
import { WaveformOutputClass } from "./WaveformOutput"

const outputInstance = (object: OutputConstructorArgs): Output => {
  const { output } = object
  const { format, type } = output
  if (!(format || type)) throw Errors.invalid.type

  const outputType = type || outputDefaultTypeByFormat[format!]
  return OutputFactory[outputType](object)
}

const outputInstanceAudio = (object: OutputConstructorArgs): AudioOutput => {
  return new AudioOutputClass(object)
}

const outputInstanceImage = (object: OutputConstructorArgs): ImageOutput => {
  return new ImageOutputClass(object)
}

const outputInstanceVideo = (object: OutputConstructorArgs): VideoOutput => {
  return new VideoOutputClass(object)
}

const outputInstanceVideoSequence = (object: OutputConstructorArgs): VideoSequenceOutput => {
  return new VideoSequenceOutputClass(object)
}

const outputInstanceWaveform = (object: OutputConstructorArgs): WaveformOutput => {
  return new WaveformOutputClass(object)
}


/**
 * @category Factory
 */
const OutputFactory = {
  instance: outputInstance,
  [OutputType.Audio]: outputInstanceAudio,
  [OutputType.Image]: outputInstanceImage,
  [OutputType.Video]: outputInstanceVideo,
  [OutputType.VideoSequence]: outputInstanceVideoSequence,
  [OutputType.Waveform]: outputInstanceWaveform,
}

export { OutputFactory }

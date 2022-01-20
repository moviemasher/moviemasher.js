import { MashEditorOptions } from "../Editor/MashEditor/MashEditor"
import { OutputObject } from "../Output/Output"
import { colorTransparent } from "../Utilities/Color"


const MashEditorDefaults: MashEditorOptions = {
  buffer: 10,
  fps: 0,
  loop: true,
  volume: 0.75,
  precision: 3,
  autoplay: false,
}
const DefaultOutput: OutputObject = {
  backcolor: colorTransparent,
  options: {},
  width: 320,
  height: 240,
  fps: 30,
  videoBitrate: 2000,
  audioBitrate: 160,
  audioCodec: 'aac',
  videoCodec: 'libx264',
  audioChannels: 2,
  audioFrequency: 44100,
  g: 0,
  format: '',
}

const MashDefaults = { // MashOptions
  label: "Unlabeled Mash",
  quantize: 10,
  backcolor: colorTransparent,
  gain: 0.75,
  buffer: 10,
  output: DefaultOutput,
}

const Default = {
  label: "Unlabeled",
  masher: MashEditorDefaults,
  mash: MashDefaults,
  instance: {
    audio: { gain: 1.0, trim: 0, loop: 1 },
    video: { speed: 1.0 }
  },
  definition: {
    frame: { duration: 2 },
    image: { duration: 2 },
    theme: { duration: 3 },
    transition: { duration: 1 },
    video: { fps: 0 },
    videosequence: { pattern: '%.jpg', fps: 10, increment: 1, begin: 1, padding: 0 },
    videostream: { duration: 10 },
  },
}

export { Default, MashDefaults, MashEditorDefaults }

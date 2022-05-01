import { MashEditorOptions } from "../Editor/MashEditor/MashEditor"
import { colorTransparent } from "../Utility/Color"

export const MashEditorDefaults: MashEditorOptions = {
  buffer: 10,
  fps: 30,
  loop: true,
  volume: 0.75,
  precision: 3,
  autoplay: false,
}

export const MashDefaults = {
  label: "Unlabeled Mash",
  quantize: 10,
  backcolor: colorTransparent,
  gain: 0.75,
  buffer: 10,
}

const CastDefaults = {
  label: "Unlabeled Cast",
  quantize: 10,
  backcolor: colorTransparent,
  gain: 0.75,
  buffer: 10,
}

export const Default = {
  label: "Unlabeled",
  masher: MashEditorDefaults,
  cast: CastDefaults,
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

import { EditorArgs } from "../Editor/Editor"
import { colorBlack, colorTransparent } from "../Utility/Color"

export const MashEditorDefaults: EditorArgs = {
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
  backcolor: colorBlack,
  gain: 0.75,
  buffer: 10,
}

export const Default = {
  frames: 30,
  label: "Unlabeled",
  masher: MashEditorDefaults,
  cast: CastDefaults,
  mash: MashDefaults,
  instance: {
    audio: { gain: 1.0, trim: 0, loop: 1 },
    video: { speed: 1.0 }
  },
  definition: {
    image: { duration: 2 },
    textcontainer: { duration: 3 },
    shape: { duration: 3 },
    visible: { duration: 3 },
    visibleclip: { duration: 3 },
    video: { fps: 0 },
    videosequence: { pattern: '%.jpg', fps: 10, increment: 1, begin: 1, padding: 0 },
    videostream: { duration: 10 },
  },
}

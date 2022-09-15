import { EditorArgs } from "../Editor/Editor"
import { colorBlack } from "../Utility/Color"

const DefaultEditorArgs: EditorArgs = {
  buffer: 10,
  fps: 30,
  loop: true,
  volume: 0.75,
  precision: 3,
  autoplay: false,
}

const DefaultMash = {
  label: "Mash",
  quantize: 10,
  color: colorBlack,
  gain: 0.75,
  buffer: 10,
}

const DefaultCast = {
  label: "Cast",
  quantize: 10,
  color: colorBlack,
  gain: 0.75,
  buffer: 10,
}

export const Default = {
  duration: 3,
  label: "Unlabeled",
  editor: DefaultEditorArgs,
  cast: DefaultCast,
  mash: DefaultMash,
  definition: {
    image: { duration: 2 },
    textcontainer: { duration: 3 },
    shape: { duration: 3 },
    visible: { duration: 3 },
    video: { fps: 0 },
    videosequence: { pattern: '%.jpg', fps: 10, increment: 1, begin: 1, padding: 0 },
    videostream: { duration: 10 },
  },
}

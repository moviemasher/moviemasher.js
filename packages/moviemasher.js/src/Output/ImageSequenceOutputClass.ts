import { AVType, OutputType } from "../Setup/Enums"
import { AudioOutputClass } from "./AudioOutputClass"
import { ImageSequenceOutput, ImageSequenceOutputArgs } from "./Output"

export class ImageSequenceOutputClass extends AudioOutputClass implements ImageSequenceOutput {
  declare args: ImageSequenceOutputArgs

  _avType = AVType.Video


  outputType = OutputType.ImageSequence
}

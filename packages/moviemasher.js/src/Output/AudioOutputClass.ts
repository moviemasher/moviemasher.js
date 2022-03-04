import { AVType, OutputType } from "../Setup/Enums"
import { AudioOutput, AudioOutputArgs } from "./Output"
import { RenderingOutputClass } from "./RenderingOutputClass"

class AudioOutputClass extends RenderingOutputClass implements AudioOutput {
  declare args: AudioOutputArgs

  avType = AVType.Audio

  outputType = OutputType.Audio
}

export { AudioOutputClass }

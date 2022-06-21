import { AVType, OutputType } from "../Setup/Enums"
import { AudioOutput, AudioOutputArgs } from "./Output"
import { RenderingOutputClass } from "./RenderingOutputClass"

export class AudioOutputClass extends RenderingOutputClass implements AudioOutput {
  declare args: AudioOutputArgs

  avType = AVType.Audio

  outputType = OutputType.Audio
}

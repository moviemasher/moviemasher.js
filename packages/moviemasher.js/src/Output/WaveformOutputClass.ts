import { AVType, OutputType } from "../Setup"
import { WaveformOutput, WaveformOutputArgs } from "./Output"
import { RenderingOutputClass } from "./RenderingOutputClass"

class WaveformOutputClass extends RenderingOutputClass implements WaveformOutput {
  declare args: WaveformOutputArgs

  avType = AVType.Audio

  outputType = OutputType.Waveform
}

export { WaveformOutputClass }

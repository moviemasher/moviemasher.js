import { AVType, OutputType } from "../Setup"
import { WaveformOutput, WaveformOutputArgs } from "./Output"
import { RenderingOutputClass } from "./RenderingOutputClass"

class WaveformOutputClass extends RenderingOutputClass implements WaveformOutput {
  declare args: WaveformOutputArgs

  avType = AVType.Audio

  outputType = OutputType.Waveform

  get sizePromise(): Promise<void> { return Promise.resolve() }
}

export { WaveformOutputClass }


// layers = []
// layers << "color=s=#{output[:dimensions]}:c=##{output[:backcolor]}[bg]"
// layers << "[0:a]aformat=channel_layouts=mono,showwavespic=colors=##{output[:forecolor]}:s=#{output[:dimensions]}[fg]"
// layers << "[bg][fg]overlay=format=rgb"

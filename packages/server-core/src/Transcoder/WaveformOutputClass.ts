import { RenderingOutputClass } from "../Encoder"
import { WaveformOutput } from "./ImageSequenceOutputArgs"

export class WaveformOutputClass extends RenderingOutputClass implements WaveformOutput {
}

// layers = []
// layers << "color=s=#{output[:dimensions]}:c=##{output[:backcolor]}[bg]"
// layers << "[0:a]aformat=channel_layouts=mono,showwavespic=colors=##{output[:forecolor]}:s=#{output[:dimensions]}[fg]"
// layers << "[bg][fg]overlay=format=rgb"

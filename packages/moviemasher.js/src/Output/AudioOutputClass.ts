import { AVType, OutputType } from "../Setup/Enums"
import { AudioOutput, AudioOutputArgs } from "./Output"
import { RenderingOutputClass } from "./RenderingOutputClass"

export class AudioOutputClass extends RenderingOutputClass implements AudioOutput {
  declare args: AudioOutputArgs

  _avType = AVType.Audio
  
  outputType = OutputType.Audio

//   get renderingDescription(): RenderingDescription {
//     const { renderingClips } = this
//     const noAudio = renderingClips.some(clip => !clip.mutable)
//     if (noAudio) return { commandOutput: this.commandOutput }

//     return super.renderingDescription
//   }
}

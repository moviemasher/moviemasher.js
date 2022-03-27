import { AVType, OutputType } from "../Setup/Enums"
import { AudioOutputClass } from "./AudioOutputClass"
import { VideoOutput, VideoOutputArgs } from "./Output"

class VideoOutputClass extends AudioOutputClass implements VideoOutput {
  declare args: VideoOutputArgs

  avType = AVType.Video

  get outputCover(): boolean { return !!this.args.commandOutput.cover }

  outputType = OutputType.Video
}

export { VideoOutputClass }

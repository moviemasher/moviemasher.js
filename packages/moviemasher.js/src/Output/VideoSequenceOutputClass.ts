import { AVType, OutputType } from "../Setup/Enums"
import { AudioOutputClass } from "./AudioOutputClass"
import { VideoSequenceOutput, VideoSequenceOutputArgs } from "./Output"

class VideoSequenceOutputClass extends AudioOutputClass implements VideoSequenceOutput {
  declare args: VideoSequenceOutputArgs


  avType = AVType.Video

  get outputCover(): boolean { return !!this.args.commandOutput.cover }

  outputType = OutputType.VideoSequence
}

export { VideoSequenceOutputClass }

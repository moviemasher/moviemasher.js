import { VideoStreamOutput, VideoStreamOutputArgs } from "./Output"
import { StreamingOutputClass } from "./StreamingOutputClass"

class VideoStreamOutputClass extends StreamingOutputClass  implements VideoStreamOutput {
  declare args: VideoStreamOutputArgs
}

export { VideoStreamOutputClass }

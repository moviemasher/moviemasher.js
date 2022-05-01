import { VideoStreamOutput, VideoStreamOutputArgs } from "./Output"
import { StreamingOutputClass } from "./StreamingOutputClass"

export class VideoStreamOutputClass extends StreamingOutputClass  implements VideoStreamOutput {
  declare args: VideoStreamOutputArgs
}

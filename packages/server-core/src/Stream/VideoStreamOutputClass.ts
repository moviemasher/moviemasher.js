import { VideoStreamOutput, VideoStreamOutputArgs } from "./StreamingCommandOutput"
import { StreamingOutputClass } from "./StreamingOutputClass"

export class VideoStreamOutputClass extends StreamingOutputClass  implements VideoStreamOutput {
  declare args: VideoStreamOutputArgs
}

import { AVType, OutputType } from "../Setup/Enums"
import { AudioOutputClass } from "./AudioOutputClass"
import { VideoOutput, VideoOutputArgs } from "./Output"

export class VideoOutputClass extends AudioOutputClass implements VideoOutput {
  declare args: VideoOutputArgs

  get avType() { 
    return this.args.commandOutput.mute ? AVType.Video : AVType.Both 
  } 

  get outputCover(): boolean { return !!this.args.commandOutput.cover }

  outputType = OutputType.Video
}

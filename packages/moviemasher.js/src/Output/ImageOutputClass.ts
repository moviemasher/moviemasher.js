import { FilterGraphOptions } from "../Edited/Mash/FilterGraph/FilterGraph"
import { Time } from "../Helpers/Time/Time"
import { timeFromArgs } from "../Helpers/Time/TimeUtilities"
import { AVType, OutputType } from "../Setup/Enums"
import { ImageOutput, ImageOutputArgs } from "./Output"
import { RenderingOutputClass } from "./RenderingOutputClass"

class ImageOutputClass extends RenderingOutputClass implements ImageOutput{
  declare args: ImageOutputArgs

  avType = AVType.Video

  protected override get mashDurationPromise(): Promise<void> {
    const { args } = this
    if (args.offset) return super.mashDurationPromise

    this.assureClipFrames()
    return Promise.resolve()
  }

  override get endTime(): Time | undefined { return }

  override get filterGraphOptions(): FilterGraphOptions {
    const {args, graphType, avType, startTime } = this
    const { mash } = args
    const { quantize } = mash
    const filterGraphOptions: FilterGraphOptions = {
      preloading: false,
      size: this.sizeCovered(), videoRate: quantize,
      time: startTime,
      graphType, avType
    }
    return filterGraphOptions
  }

  override get outputCover(): boolean {
    // console.log(this.constructor.name, "outputCover", this.args.commandOutput)
    return !!this.args.commandOutput.cover
  }

  outputType = OutputType.Image

  override get startTime(): Time {
     const { commandOutput, mash } = this.args
    const { offset } = commandOutput
    const needDuration = offset || mash.frames < 0
    if (needDuration) return timeFromArgs(0, mash.quantize)

    return mash.timeRange.positionTime(Number(offset || 0), 'ceil')
  }
}

export { ImageOutputClass }
// ffmpeg -i /Users/doug/GitHub/moviemasher.js/dev/shared/video.mp4 -y -filter_complex 'color=color=#00000000:size=427x240[COLORBACK];[0:v]trim=start=1[TRIM0];[TRIM0]fps=fps=10[FPS0];[FPS0]setpts=expr=PTS-STARTPTS[SETPTS0];[SETPTS0]setsar=sar=1:max=1[SETSAR0];[SETSAR0]scale=width=427:height=240[SCALE0];[SCALE0]setsar[SETSAR1];[COLORBACK][SETSAR1]overlay=x=0:y=0' -frames:v 1 temporary/test/render/image-from-trimmed-video/image.png

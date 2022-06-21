import { FilterGraphsOptions } from "../Edited/Mash/FilterGraphs/FilterGraphs"
import { Time } from "../Helpers/Time/Time"
import { timeFromArgs } from "../Helpers/Time/TimeUtilities"
import { AVType, OutputType } from "../Setup/Enums"
import { ImageOutput, ImageOutputArgs } from "./Output"
import { RenderingOutputClass } from "./RenderingOutputClass"

export class ImageOutputClass extends RenderingOutputClass implements ImageOutput{
  declare args: ImageOutputArgs

  avType = AVType.Video

  protected override get mashDurationPromise(): Promise<void> {
    const { args } = this
    if (args.offset) return super.mashDurationPromise

    this.assureClipFrames()
    return Promise.resolve()
  }

  override get endTime(): Time | undefined { return }

  override get filterGraphsOptions(): FilterGraphsOptions {
    const {args, graphType, avType, startTime } = this
    const { mash } = args
    const { quantize } = mash
    const filterGraphsOptions: FilterGraphsOptions = {
      size: this.sizeCovered(), videoRate: quantize,
      time: startTime,
      graphType, avType
    }
    return filterGraphsOptions
  }

  override get outputCover(): boolean {
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

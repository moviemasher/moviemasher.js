import { Time } from "../Helpers/Time"
import { TimeRange } from "../Helpers/TimeRange"
import { AVType, OutputType } from "../Setup/Enums"
import { ImageOutput, ImageOutputArgs } from "./Output"
import { RenderingOutputClass } from "./RenderingOutputClass"
import { FilterGraphArgs } from "../declarations"

class ImageOutputClass extends RenderingOutputClass implements ImageOutput{
  declare args: ImageOutputArgs

  avType = AVType.Video

  protected override get durationPromise(): Promise<void> {
    const { args } = this
    if (args.offset) return super.durationPromise

    this.assureClipFrames()
    return Promise.resolve()
  }

  protected override get endTime(): Time | undefined { return }

  override get filterGraphArgs(): FilterGraphArgs {
    const {args, graphType, avType, renderTimeRange} = this
    const { mash } = args
    const { quantize } = mash
    const filterGraphArgs: FilterGraphArgs = {
      justGraphFiles: false,
      size: this.sizeCovered(), videoRate: quantize,
      timeRange: renderTimeRange,
      graphType,
      avType
    }
    return filterGraphArgs
  }

  override get renderTimeRange(): TimeRange {
    const { commandOutput, mash } = this.args
    const { offset } = commandOutput
    const needDuration = offset || mash.frames < 0
    if (needDuration) return TimeRange.fromArgs(0, 1, mash.quantize)

    return TimeRange.fromTime(mash.timeRange.positionTime(Number(offset || 0), 'ceil'))
  }

  override get outputCover(): boolean {
    // console.log(this.constructor.name, "outputCover", this.args.commandOutput)
    return !!this.args.commandOutput.cover
  }

  outputType = OutputType.Image

  override get renderStartTime(): Time {
    const { offset, mash } = this.args
    const { quantize } = mash
    const frame = offset ? Math.round(mash.frames / offset) : 0
    return Time.fromArgs(frame, quantize)
  }
}

export { ImageOutputClass }

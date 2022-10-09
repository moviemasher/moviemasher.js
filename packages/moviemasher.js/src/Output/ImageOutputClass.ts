import { FilterGraphsOptions } from "../Edited/Mash/FilterGraphs/FilterGraphs"
import { Time } from "../Helpers/Time/Time"
import { timeFromArgs } from "../Helpers/Time/TimeUtilities"
import { assertPreloadableDefinition } from "../Mixin/Preloadable/Preloadable"
import { AVType, OutputType } from "../Setup/Enums"
import { assertObject } from "../Utility/Is"
import { sizeCopy } from "../Utility/Size"
import { ImageOutput, ImageOutputArgs, RenderingCommandOutput } from "./Output"
import { outputDefaultPng } from "./OutputDefault"
import { RenderingOutputClass } from "./RenderingOutputClass"

export class ImageOutputClass extends RenderingOutputClass implements ImageOutput{
  declare args: ImageOutputArgs

  _avType = AVType.Video

  protected override get commandOutput(): RenderingCommandOutput { 
    const { upload, commandOutput } = this.args
    if (!upload) {
      // console.log(this.constructor.name, "commandOutput NOT UPLOAD")
      return commandOutput
    }

    const { renderingClips } = this
    const [clip] = renderingClips
    const { definition } = clip.content
    // console.log(this.constructor.name, "commandOutput", definition.label)
    assertPreloadableDefinition(definition)
    const { info } = definition
    assertObject(info)

    const { streams } = info
    const [stream] = streams
    const { pix_fmt, codec_name } = stream
    if (codec_name !== 'png') {
      // console.log("commandOutput codec_name", codec_name)
      return commandOutput
    }
    
    const { width, height, basename } = commandOutput
    const overrides ={ width, height, basename } 
    const output = outputDefaultPng(overrides)

    // console.log("commandOutput output", output, commandOutput)

    return output
  }

  override get endTime(): Time | undefined { return }

  override get filterGraphsOptions(): FilterGraphsOptions {
    const { args, graphType, avType, startTime: time } = this
    const { mash, upload } = args
    const { quantize: videoRate } = mash
    const filterGraphsOptions: FilterGraphsOptions = {
      time, graphType, videoRate, size: this.sizeCovered(), 
      avType, upload
    }
    return filterGraphsOptions
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

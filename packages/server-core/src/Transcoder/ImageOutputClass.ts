
import { RenderingCommandOutput, assertPreloadableDefinition, assertObject, Time, FilterGraphsOptions, timeFromArgs } from "@moviemasher/moviemasher.js"
import { outputDefaultPng } from "../Defaults/OutputDefault"
import { RenderingOutputClass } from "../Encoder/RenderingOutputClass"

export class ImageOutputClass extends RenderingOutputClass {

  protected override get commandOutput(): RenderingCommandOutput { 
    const {  commandOutput } = this.args

    const renderingClips = this.args.mash.clipsInTimeOfType(this.timeRange, this.avType)
    const [clip] = renderingClips
    const { definition } = clip.content
    // console.log(this.constructor.name, "commandOutput", definition.label)
    assertPreloadableDefinition(definition)
    const { info } = definition
    assertObject(info, 'info')

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
    const { args, graphType, avType, startTime, outputSize: size } = this
    const { mash } = args
    const { quantize: videoRate } = mash
    const filterGraphsOptions: FilterGraphsOptions = {
      time: startTime, graphType, videoRate, size, avType
    }
    return filterGraphsOptions
  }

  // outputType = OutputType.Image

  override get startTime(): Time {
    const { mash } = this.args
    const { frames, quantize } = mash
    if (frames < 0) return timeFromArgs(0, quantize)

    return mash.timeRange.positionTime(0, 'ceil')
  }
}

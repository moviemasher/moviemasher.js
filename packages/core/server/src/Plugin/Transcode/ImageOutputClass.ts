
import { 
  assertProbing, RenderingCommandOutput, Time, 
  timeFromArgs, 
  ProbeType,
  assertDefined
} from "@moviemasher/moviemasher.js"
import { outputDefaultPng } from "../Defaults/OutputDefault"
import { FilterGraphsOptions } from "../Encode/FilterGraphs/FilterGraphs"
import { RenderingOutputClass } from "../Encode/RenderingOutputClass"

export class ImageOutputClass extends RenderingOutputClass {

  protected override get commandOutput(): RenderingCommandOutput { 
    const {  commandOutput } = this.args

    const renderingClips = this.args.mash.clipsInTimeOfType(this.timeRange, this.avType)
    const [clip] = renderingClips
    const { definition } = clip.content
    // console.log(this.constructor.name, "commandOutput", definition.label)

    const decoding = definition.decodings.find(object => object.type === ProbeType)
    assertProbing(decoding)
    const { data } = decoding
    const { raw } = data
    assertDefined(raw)
    const { streams } = raw
    const [stream] = streams
    const { codec_name } = stream
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
    const { args, avType, startTime, outputSize: size } = this
    const { mash } = args
    const { quantize: videoRate } = mash
    const filterGraphsOptions: FilterGraphsOptions = {
      time: startTime, videoRate, size, avType
    }
    return filterGraphsOptions
  }

  // outputType = EncodeType.Image

  override get startTime(): Time {
    const { mash } = this.args
    const { frames, quantize } = mash
    if (frames < 0) return timeFromArgs(0, quantize)

    return mash.timeRange.positionTime(0, 'ceil')
  }
}

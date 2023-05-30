import type { FilterGraphsOptions } from "../Encode/FilterGraphs/FilterGraphs.js"

import { 
  assertProbing, Time, 
  timeFromArgs, 
  TypeProbe,
  assertDefined,
  outputAlphaOptions,
  TypeImage,
  OutputOptions,
  assertSize,
  ImageOutputOptions
} from "@moviemasher/lib-core"
import { RenderingOutputClass } from "../Encode/RenderingOutputClass.js"

export class ImageOutputClass extends RenderingOutputClass {

  protected override get outputOptions(): OutputOptions { 
    const { outputOptions } = this.args

    const renderingClips = this.args.mash.clipsInTimeOfType(this.timeRange, this.avType)
    const [clip] = renderingClips
    const { definition } = clip.content
    // console.log(this.constructor.name, "outputOptions", definition.label)

    const decoding = definition.decodings.find(object => object.type === TypeProbe)
    assertProbing(decoding)
    const { data } = decoding
    const { raw } = data
    assertDefined(raw)
    const { streams } = raw
    const [stream] = streams
    const { codec_name } = stream
    if (codec_name !== 'png') {
      // console.log("outputOptions codec_name", codec_name)
      return outputOptions
    }
    assertSize(outputOptions)
    
    const { width, height } = outputOptions
    const overrides: ImageOutputOptions = { width, height } 
    const output = outputAlphaOptions(TypeImage, overrides)

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

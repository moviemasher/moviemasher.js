
import { MashServerAsset, AVTypeBoth, AVTypeVideo } from "@moviemasher/lib-core"
import { FilterGraphs, FilterGraphsArgs, FilterGraphsOptions } from "./FilterGraphs.js"
import { FilterGraphsClass } from "./FilterGraphsClass.js"

export const filterGraphsArgs = (mash: MashServerAsset, options: FilterGraphsOptions = {}): FilterGraphsArgs => {
  const { background, time, avType, size, videoRate, ...rest } = options
  const definedTime = time || mash.time
  const definedAVType = avType || (definedTime.isRange ? AVTypeBoth : AVTypeVideo)
  const filterGraphsOptions: FilterGraphsArgs = {
    ...rest,
    times: mash.timeRanges(definedAVType, definedTime),
    avType: definedAVType,
    size: size || mash.imageSize,
    videoRate: videoRate || definedTime.fps,
    mash,
    background: background || mash.color,
  }
  return filterGraphsOptions
}
export const filterGraphsInstance = (args: FilterGraphsArgs): FilterGraphs => {
  return new FilterGraphsClass(args)
}

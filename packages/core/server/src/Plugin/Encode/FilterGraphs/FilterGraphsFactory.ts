
import { MashMedia, AVType } from "@moviemasher/moviemasher.js"
import { FilterGraphs, FilterGraphsArgs, FilterGraphsOptions } from "./FilterGraphs"
import { FilterGraphsClass } from "./FilterGraphsClass"

export const filterGraphsArgs = (mash: MashMedia, options: FilterGraphsOptions = {}): FilterGraphsArgs => {
  const { background, time, avType, size, videoRate, ...rest } = options
  const definedTime = time || mash.time
  const definedAVType = avType || (definedTime.isRange ? AVType.Both : AVType.Video)
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

import { BlendFilter } from "../CoreFilter/BlendFilter"
import { ChromaKeyFilter } from "../CoreFilter/ChromaKeyFilter"
import { ColorFilter } from "../CoreFilter/ColorFilter"
import { ColorChannelMixerFilter } from "../CoreFilter/ColorChannelMixerFilter"
import { ConvolutionFilter } from "../CoreFilter/ConvolutionFilter"
import { CropFilter } from "../CoreFilter/CropFilter"
import { DrawBoxFilter } from "../CoreFilter/DrawBoxFilter"
import { DrawTextFilter } from "../CoreFilter/DrawTextFilter"
import { FadeFilter } from "../CoreFilter/FadeFilter"
import { OverlayFilter } from "../CoreFilter/OverlayFilter"
import { ScaleFilter } from "../CoreFilter/ScaleFilter"
import { SetSarFilter } from "../CoreFilter/SetSarFilter"
import { CoreFilter } from "../CoreFilter/CoreFilter"

const Filters = {
  blend: BlendFilter,
  chromakey: ChromaKeyFilter,
  colorchannelmixer: ColorChannelMixerFilter,
  color: ColorFilter,
  convolution: ConvolutionFilter,
  crop: CropFilter,
  drawbox: DrawBoxFilter,
  drawtext: DrawTextFilter,
  fade: FadeFilter,
  overlay: OverlayFilter,
  scale: ScaleFilter,
  setsar: SetSarFilter,
}
const FilterTypes = Object.keys(Filters)
const FilterType = Object.fromEntries(FilterTypes.map(type => [type, type]))

const FilterFactory = {
  type: FilterType,
  types: FilterTypes,
 }

Object.defineProperties(FilterFactory, {
  create: { value(id : string) : CoreFilter { return Filters[id] } },
  created: { value(id : string)  : boolean{ return FilterTypes.includes(id) } }
})

export { FilterFactory }

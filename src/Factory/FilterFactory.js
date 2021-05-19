import { Factory } from "./Factory"
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


const FilterTypes = [
  "blend",
  "chromakey",
  "colorchannelmixer",
  "color",
  "convolution",
  "crop",
  "drawbox",
  "drawtext",
  "fade",
  "overlay",
  "scale",
  "setsar",
]
const FilterType = Object.fromEntries(FilterTypes.map(type => [type, type]))

class FilterFactory extends Factory {
  constructor() {
    super()
    this.install(FilterType.blend, BlendFilter)
    this.install(FilterType.chromakey, ChromaKeyFilter)
    this.install(FilterType.colorchannelmixer, ColorChannelMixerFilter)
    this.install(FilterType.color, ColorFilter)
    this.install(FilterType.convolution, ConvolutionFilter)
    this.install(FilterType.crop, CropFilter)
    this.install(FilterType.drawbox, DrawBoxFilter)
    this.install(FilterType.drawtext, DrawTextFilter)
    this.install(FilterType.fade, FadeFilter)
    this.install(FilterType.overlay, OverlayFilter)
    this.install(FilterType.scale, ScaleFilter)
    this.install(FilterType.setsar, SetSarFilter)
  }

  create(type) { return this.typeClass(type) }

  createFromObject(object) { return this.create(object.id) }
}

Object.defineProperties(FilterFactory.prototype, {
  type: { value: FilterType },
  types: { value: FilterTypes },
})

const FilterFactoryInstance = new FilterFactory
export { FilterFactoryInstance as FilterFactory }


import { ClipType } from "../Setup"
import { sharedClip } from "./with/sharedClip"
import { inaudible } from "./with/inaudible"
import { visibleClip } from "./with/visibleClip"
import { speedOne } from "./with/speedOne"
import { urls } from "./with/urls"
import { transform } from "./with/transform"
import { evaluator } from "./with/evaluator"
import { Context } from "../Utilities"
import { drawMediaFilters } from "./with/drawMediaFilters"
import { mediaTime } from "./with/mediaTime"
import { Clip } from "./Clip"
import { Is } from "../Utilities"

class ThemeClip extends Clip {}

Object.defineProperties(ThemeClip.prototype, {
  type: { value: ClipType.theme },
  ...sharedClip,
  ...inaudible,
  ...visibleClip,
  ...speedOne,
  ...urls,
  ...inaudible,
  ...transform,
  ...evaluator,
  ...drawMediaFilters,
  ...mediaTime,
  contextAtTimeForDimensions: {
    value: function(mashTime, dimensions) {
      const context = Context.createDrawing(dimensions.width, dimensions.height)
      const clipTimeRange = this.timeRangeRelative(mashTime)
      if (Is.undefined(clipTimeRange)) return
      
      return this.drawMediaFilters(clipTimeRange, context, dimensions)
    }
  },
})

export { ThemeClip }
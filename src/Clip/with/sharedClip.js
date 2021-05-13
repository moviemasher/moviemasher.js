import { toJSON } from "./toJSON"
import { track } from "./track"
import { id } from "./id"
import { labelFromObjectOrMedia } from "./labelFromObjectOrMedia"
import { media } from "./media"
import { propertyValues } from "./propertyValues"
import { propertiesFromMedia } from "./propertiesFromMedia"
import { copy } from "./copy"
import { load } from "./load"
import { editable } from "../../Base/with/editable"
import { TimeFactory } from "../../Factory/TimeFactory"
import { TimeRangeFactory } from "../../Factory/TimeRangeFactory"

export const sharedClip = {
  ...editable,
  ...copy,
  ...toJSON,
  ...id,
  ...labelFromObjectOrMedia,
  ...track,
  time: {
    value: function(quantize) { 
      return TimeFactory.create(this.frame, quantize) 
    }
  },
  timeRange: { 
    value: function(quantize) { 
      const options = { frame: this.frame, quantize, frames: this.frames }
      return TimeRangeFactory.create(options)
    }
  },
  timeRangeRelative: {
    value: function(mashTime) {
      const range = this.timeRange(mashTime.fps)
      const frame = mashTime.frame - this.frame
      if (frame < 0) {
        console.log(this.constructor.name, "timeRangeRelative", mashTime, range)
        return
      }
      return range.withFrame(frame)
    }
  },
  ...media,
  ...propertyValues,
  ...propertiesFromMedia,
  ...load,
}





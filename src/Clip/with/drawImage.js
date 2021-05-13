import { TimeRangeFactory } from "../../Factory/TimeRangeFactory"
import { Errors } from "../../Errors"
import { Context } from "../../Utilities"
import { Cache } from "../../Cache"
import { Is } from "../../Is"

export const drawImage = {
  contextAtTimeForDimensions: { 
    value: function(mashTime, dimensions) {
      const range = TimeRangeFactory.createFromTime(mashTime)
      const urls = this.media.urlsVisibleInTimeRangeForClipByType(range, this) 
      const url = urls.image[0]

      const resource = Cache.get(url)
      if (!Is.object(resource)) throw Errors.uncached + url + " contextAtTimeForDimensions"
    
      const { width, height } = resource
      let context = Context.createDrawing(width, height)
      context.drawImage(resource, 0, 0, width, height, 0, 0, width, height)
      return context
    }
  },
}
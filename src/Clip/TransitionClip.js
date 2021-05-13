import { ClipType, TransformType, TransformTypes } from "../Types"
import { sharedClip } from "./with/sharedClip"
import { visible } from "./with/visible"
import { urlsFromMedia } from "./with/urlsFromMedia"
import { Utilities } from "../Utilities"
import { Merger, Scaler } from "../Transform"
import { Is } from "../Is"
import { Context } from "../Utilities"
import { ColorFilter } from "../CoreFilter"

import { Sort } from "../Sort";
import { mediaTime } from "./with/mediaTime"
import { Clip } from "./Clip"
const ChildTypes = ["to", "from"]
const ChildType = Object.fromEntries(ChildTypes.map(type => [type, type]))

class TransitionClip extends Clip {
  constructor(object) {
    super(object)
    this.children = Object.fromEntries(ChildTypes.map(type => [type, {}]))
  }
}


const definition = {
  type: { value: ClipType.transition },
  ...sharedClip,
  ...visible,
  ...urlsFromMedia,
  ...mediaTime,
  contextAtTimeForDimensions: {
    value: function(mashTime, dimensions, color, clips = []) {
      const sorted = clips.sort(Sort.byFrame)

      const context = Context.createDrawing(dimensions.width, dimensions.height)
      ColorFilter.draw( { context }, { color } )

      const [fromClip, toClip] = sorted
      const defined = {
        [ChildType.to]: Is.object(toClip) && toClip, 
        [ChildType.from]: Is.object(fromClip) && fromClip, 
      }
      ChildTypes.forEach(childType => {
        const clip = defined[childType]
        if (!clip) return

        const drawing = Context.createDrawing(dimensions.width, dimensions.height)
        ColorFilter.draw( { drawing }, { color } )

        clip.mergeContextAtTime(mashTime, drawing)


        const merger = this.child(childType, TransformType.merger)
        const scaler = this.child(childType, TransformType.scaler)

    
        const clipTimeRange = this.timeRangeRelative(mashTime)
        if (Is.undefined(clipTimeRange)) return
      
        const scaled = scaler.drawMediaFilters(clipTimeRange, drawing, dimensions)
        merger.drawMerger(clipTimeRange, scaled, context)
      })

      return context
    }
  },
  // urlsVisibleInTimeRangeByType: { 
  //   value: function(timeRange) { 
  //     const urls = new UrlsByType

  //     ChildTypes.forEach(type => {
  //       urls.concat(this.child())
  //     })
      
  //     return this.media.urlsVisibleInTimeRangeForClipByType(timeRange, this) 
  //   }
  // },
  initializeChild: {
    value: function(childType, transformType) {
      const klass = transformType === TransformType.merger ? Merger : Scaler
      return new klass(this.object[childType])
    }
  },
  child: { 
    value: function(childType, transformType) { 
      return this[`${childType}${Utilities.capitalize(transformType)}`]
    }
  },
}

ChildTypes.forEach(childType => {
  definition[childType] = {
    get: function() { 
      if (Is.undefined(this.children[childType])) this.children[childType] = {}
      return this.children[childType] 
    }
  }

  TransformTypes.forEach(transformType => {
    definition[`${childType}${Utilities.capitalize(transformType)}`] = {
      get: function() { 
        if (Is.undefined(this.children[childType][transformType])) {
          const child = this.initializeChild(childType, transformType)
          this.children[childType][transformType] = child
        }
        return this.children[childType][transformType] 
      }
    }
  })
})

Object.defineProperties(TransitionClip.prototype, definition)

export { TransitionClip }

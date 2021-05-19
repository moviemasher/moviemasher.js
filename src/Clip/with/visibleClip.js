import { Is } from "../../Utilities"
import { TrackType } from "../../Setup/Types"

export const visibleClip = { 
  visible: { value: true },

  trackType: { value: TrackType.video },

  scaledContextAtTimeForDimensions: {
    value: function(mashTime, dimensions, ...rest) {
      const context = this.contextAtTimeForDimensions(mashTime, dimensions, ...rest)
      // console.log("scaledContextAtTimeForDimensions", context)
      if (!this.scaler) return context

      const clipTimeRange = this.timeRangeRelative(mashTime)
      if (Is.undefined(clipTimeRange)) return
      
      return this.scaler.drawMediaFilters(clipTimeRange, context, dimensions)
    }
  },

  effectedContextAtTimeForDimensions: {
    value: function(mashTime, dimensions, ...rest) {
      let context = this.scaledContextAtTimeForDimensions(mashTime, dimensions, ...rest)
      if (!this.effects) return context

      const clipTimeRange = this.timeRangeRelative(mashTime)
      if (Is.undefined(clipTimeRange)) return
      
      this.effects.reverse().forEach(effect => 
        context = effect.drawMediaFilters(clipTimeRange, context, dimensions)
      )
      return context
    }
  },
  
  mergeContextAtTime: { 
    value: function(mashTime, context, ...rest) { 
      
      if (!this.merger) return context
      const effected = this.effectedContextAtTimeForDimensions(mashTime, context.canvas, ...rest)
      
      const clipTimeRange = this.timeRangeRelative(mashTime)
      if (Is.undefined(clipTimeRange)) return
      
      return this.merger.drawMerger(clipTimeRange, effected, context)
    }
  },
}
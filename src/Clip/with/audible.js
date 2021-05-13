import { TimeRangeFactory } from "../../Factory/TimeRangeFactory"
import { TimeFactory } from "../../Factory/TimeFactory"

export const audible = { 
  audible: { get: function() { 
    const audible = this.media.audible && !this.muted
    if (!audible) console.log(this.constructor.name, "audible false:", this.media.audible, !this.muted)
    return audible
  } },
  muted: { 
    get: function() {
      switch(this.gain) {
          case 0:
          case '0':
          case '0,0,1,0': return true
      }
      return false
    }
  },
  urlsAudibleInTimeRangeByType: { 
    value: function(timeRange) { 
      const range = this.mediaTimeRange(timeRange)
      return this.media.urlsAudibleInTimeRangeForClipByType(range) 
    }
  },
  mediaTime: { 
    value: function(time, add_one_frame = false) {
      const end_time = TimeFactory.create(this.frame + this.frames, time.quantize)
      const limited_time = time.min(end_time)
      const start_time = TimeFactory.create(this.frame, time.quantize)
      let media_time = limited_time.subtract(start_time)

      if (add_one_frame) {
        const frame_at_speed = this.speed ? Math.ceil(this.speed) : 1
        media_time = media_time.add(TimeFactory.create(frame_at_speed, this.quantize))
      }
      if (this.trim) {
        media_time = media_time.add(TimeFactory.create(this.trim, this.quantize))
      }
      if (this.speed) {
        media_time = media_time.divide(this.speed, 'ceil')
      }
      return media_time
    } 
  },
  mediaTimeRange: { 
    value: function(timeRange) { 
      const add_one_frame = (timeRange.frames > 1)
      return TimeRangeFactory.createFromTimes(
        this.mediaTime(timeRange.startTime), 
        this.mediaTime(timeRange.endTime, add_one_frame)
      )
    } 
  },
}

import { TimeRangeFactory } from "../../Factory/TimeRangeFactory"
import { TimeFactory } from "../../Factory/TimeFactory"

export const mediaTimeFromTrim = {
  mediaTime: {
    value: function(time, add_one_frame = false) {
      const end_time = TimeFactory.createFromFrame(this.frame + this.frames, time.quantize)
      const limited_time = time.min(end_time)
      const start_time = TimeFactory.createFromFrame(this.frame, time.quantize)
      let media_time = limited_time.subtract(start_time)

      if (add_one_frame) {
        const frame_at_speed = this.speed ? Math.ceil(this.speed) : 1
        media_time = media_time.add(TimeFactory.createFromFrame(frame_at_speed, this.quantize))
      }
      if (this.trim) {
        media_time = media_time.add(TimeFactory.createFromFrame(this.trim, this.quantize))
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

import { LoadType } from "../../Types"
import { TimeFactory } from "../../Factory/TimeFactory"
import { Is } from "../../Is"
import { UrlsByType } from "../../Utilities"

export const urlsVisibleFrames = { 
  fps: { get: function() { return this.__fps ||= this.object.fps || 10 } },

  framesMax: { 
    get: function() { return Math.floor(this.fps * this.duration) } 
  },

  begin: { get: function() { return this.__begin ||= this.object.begin || 1 } },

  pattern: { 
    get: function() { return this.__pattern ||= this.object.pattern || '%.jpg' } 
  },

  increment: { 
    get: function() { return this.__increment ||= this.object.increment || 1 } 
  },

  zeropadding: { 
    get: function() { 
      return this.__zeropadding ||= this.zeropaddingInitialize 
    } 
  },

  zeropaddingInitialize: {
    get: function() { 
      const value = this.object.zeropadding
      if (Is.defined(value)) return value

      const last_frame = this.begin + (this.increment * this.framesMax)
      return String(last_frame).length
    }
  },

  url: { get: function() { return this.__url ||= this.object.url || "" } },
  
  limitedTimeRange: { value: function(timeRange) {
    return timeRange.minEndTime(TimeFactory.create(this.framesMax, this.fps))
  } },

  urlsVisibleInTimeRangeForClipByType: { 
    value: function(timeRange, clip) { 
      const urls = new UrlsByType
      const max_frames = this.framesMax
      const range = this.limitedTimeRange(timeRange)//.scale(this.fps)
      //console.log("range", range)
        
      let last_frame
      for (let frame = range.frame; frame < range.end; frame++) {

        const time = TimeFactory.create(frame, range.fps)
        const media_time = time.scale(this.fps)
        
        //console.log(time, media_time)
        if ((frame !== range.frame) && (last_frame === media_time.frame)) { 
          continue 
        }
        last_frame = media_time.frame;
        last_frame = Math.min(last_frame, max_frames - 1)
        let s = String((Math.min(last_frame, max_frames) * this.increment) + this.begin)
        if (this.zeropadding) s = s.padStart(this.zeropadding, '0')
        const url = (this.url + this.pattern).replaceAll('%', s)
        urls[LoadType.image].push(url)
      }
      return urls
    } 
  }
}

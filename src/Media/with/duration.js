import { Default } from "../../Default"
import { Is } from "../../Is"

export const duration = { 
  duration: { 
    get: function() { 
      if (Is.undefined(this.__duration)) {
        this.__duration = Number(this.object.duration)
        this.__duration ||= Default.media[this.type].duration 
      }
      return this.__duration 
    }
  }, 
} 

import { Default } from "../../Setup"
import { Is } from "../../Utilities"

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

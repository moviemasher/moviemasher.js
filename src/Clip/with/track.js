import { Is } from "../../Utilities/Is"

export const track = { 
  track: { 
    get: function() { 
      if (Is.undefined(this.__track)) {
        const track = this.object.track 
        this.__track = Is.defined(track) ? track : -1
      }
      return this.__track 
    },
    set: function(value) { this.__track = value }
  }, 
}
 
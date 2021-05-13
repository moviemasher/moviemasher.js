import { Errors } from "../../Errors"
import { Id } from "../../Utilities/Id"

export const deprecated = {
  uuid: { value: function() { return Id() } },

  did: { value: function(_removedCount) {
    // angular-moviemasher overrides this to be alerted when we actions that
    // could be undone are destroyed (because we undid then did something else)
  }},
  canvas_context: {
    get: function() { 
      console.warn(Errors.deprecation.canvas_context.get)
      return this.videoContext
    },
    set: function(value) { 
      console.warn(Errors.deprecation.canvas_context.set)
      this.videoContext = value 
    }
  },
  buffertime: {
    get: function() { return this.buffer },
    set: function(value) { this.buffer = value }
  },
  minbuffertime: {
    get: function() { return this.buffer },
    set: function(value) { this.buffer = value }
  },
}

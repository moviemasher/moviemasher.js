import { Context } from "../../Utilities"

export const contexts = {
  videoContext: { 
    get: function() { 
      this.__videoContext ||= this.object.videoContext || Context.createVideo()
      return this.__videoContext
    },
    set: function(value) { 
      this.__videoContext = value 
      if (this.composition) this.composition.videoContext = value
    }
  },
  audioContext: { 
    get: function() { 
      this.__audioContext ||= this.object.audioContext || Context.createAudio()
      return this.__audioContext
    },
    set: function(value) { 
      this.__audioContext = value 
      if (this.composition) this.composition.audioContext = value
    }
  },
}

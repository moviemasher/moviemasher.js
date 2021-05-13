export const urlAudibleMute = { 
  urlAudible: { 
    get: function() { 
      switch (this.object.audio) {
        case undefined: return this.object.source
        case 0: return
      }
      return this.object.audio
    } 
  },
}

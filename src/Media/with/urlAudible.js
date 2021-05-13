export const urlAudible = { 
  urlAudible: { 
    get: function() { 
      return this.object.audio || this.object.url || this.object.source 
    } 
  },
}

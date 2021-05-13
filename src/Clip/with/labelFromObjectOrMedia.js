export const labelFromObjectOrMedia = { 
  label: { 
    get: function() { return this.__label ||= this.labelInitialize },
    set: function(value) { this.__label = value }
  },
  labelInitialize: { 
    get: function() { return this.object.label || this.media.label }
  },
}

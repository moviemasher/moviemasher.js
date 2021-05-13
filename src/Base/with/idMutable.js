export const idMutable = {
  id: { 
    get: function() { return this.__id ||= this.object.id },
    set: function(value) { 
      this.__id = value 
      this.__media = null
    }
  }
}
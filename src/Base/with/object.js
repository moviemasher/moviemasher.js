export const object = { 
  property: { value: function(key) { return this[key] || this.object[key] } },
  
}

export const copy = {
  copy: { get: function() { return new this.constructor(this.toJSON()) } }
}

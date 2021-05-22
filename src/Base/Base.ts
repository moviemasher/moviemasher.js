import { Errors } from "../Setup"
import { Is } from "../Utilities"

class Base {
  object : {
    [key: string] : any
  }

  constructor(object = {}) {
    if (!Is.object(object)) throw Errors.object

    this.object = object
  }

  get(property : string) : number | string { return this[property] }

  set(property : string, value : number | string) { this[property] = value }

  toJSON() { return this.object }

  toString() { return `[${this.constructor.name}]` }
}

export { Base }

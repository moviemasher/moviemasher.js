import { Errors } from "../Setup"
import { Is } from "../Utilities"

class Base {
  constructor(object = {}) {
    if (!Is.objectStrict(object)) throw Errors.object

    this.object = object
  }

  toJSON() { return this.object }

  toString() { return `[${this.constructor.name}]` }
}

export { Base }

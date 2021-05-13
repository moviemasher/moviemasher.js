
import { Errors } from "../Errors"
import { Is } from "../Is"

class Factory {
  constructor() { this.classesByType = {} }

  typeClass(type) {
    const klass = Is.string(type) ? this.classesByType[type] : this.baseClass
    if (!klass) throw(Errors.unknown.type + type)
    return klass
  }

  create(type) { 
    if (!Is.string(type)) return this.createFromObject(type)
    
    const klass = this.typeClass(type)
    return new klass() 
  }

  createFromObject(object) {
    if (!Is.object(object)) throw(Errors.object)
    const klass = this.typeClass(object.type)
    if (Is.instance(object, klass)) return object
    
    return new klass(object)
  }

  install(type, klass) { this.classesByType[type] = klass }
}

export { Factory }

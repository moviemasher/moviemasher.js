/* eslint-disable no-unused-vars */
import { Base } from "../Base"
import { Errors } from "../Setup"
import { Is } from "../Utilities/Is"

interface FactoryInterface {

}
interface TypedObject {
  type: string
}

interface TypedObjectConstructor {
  new (object : TypedObject) : FactoryInterface
}

class Factory implements FactoryInterface {
  classesByType: Map<string, TypedObjectConstructor>

  baseClass: TypedObjectConstructor

  constructor(baseClass:TypedObjectConstructor) {
    this.baseClass = baseClass || Base
    this.classesByType = new Map()
  }

  typeClass(type:string):TypedObjectConstructor {
    const typedClass = this.classesByType.get(type)
    if (!typedClass) return this.baseClass

    return typedClass
  }

  create(type:string | TypedObject) : object {
    if (typeof type === "string") return this.createFromType(type)

    return this.createFromObject(type)
  }

  createFromObject(object:TypedObject) : object {
    if (!Is.object(object)) throw Errors.object
    const Klass = this.typeClass(object.type)
    if (Is.instanceOf(object, Klass)) return object

    return new Klass(object)
  }

  createFromType(type:string) : object {
    const Klass = this.typeClass(type)

    return new Klass({ type })
  }

  install(type:string, klass:TypedObjectConstructor) { this.classesByType.set(type, klass) }
}

export { Factory }

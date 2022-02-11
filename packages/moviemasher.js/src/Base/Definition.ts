import { Any, Constrained, Described, FilesArgs, GraphFile, UnknownObject } from "../declarations"
import { DefinitionType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { Property } from "../Setup/Property"
import { Time, Times } from "../Helpers/Time"
import { Is } from "../Utility/Is"
import { Instance, InstanceBase, InstanceObject } from "./Instance"
import { SelectionValue } from "./Propertied"

interface DefinitionDescription extends UnknownObject, Described {
  type: DefinitionType | string
}
interface DefinitionObject extends Partial<DefinitionDescription> {
  source?: string
}

class DefinitionBase {
  constructor(...args : Any[]) {
    const [object] = args
    const { id, label, icon } = <DefinitionObject> object
    if (!(id && Is.populatedString(id))) throw Errors.invalid.definition.id + JSON.stringify(object)
    this.id = id

    this.label = label || id
    if (icon) this.icon = icon

  }

  definitionUrls(start: Time, end?: Time): string[] { return [] }

  files(args: FilesArgs): GraphFile[] { return [] }

  icon? : string

  id : string

  get instance() : Instance {
    return this.instanceFromObject(this.instanceObject)
  }

  instanceFromObject(object : InstanceObject) : Instance {
    const instance = new InstanceBase({ ...this.instanceObject, ...object })
    return instance
  }

  get instanceObject() : InstanceObject {
    const object : UnknownObject = {}
    object.definition = this
    this.properties.forEach(property => { object[property.name] = property.value })
    return object
  }

  label : string

  // loadDefinition(quantize: number, start : Time, end? : Time) : LoadPromise | void { }

  properties : Property[] = []

  get propertiesModular() : Property[] { return this.properties.filter(property => property.type.modular) }

  property(name : string) : Property | undefined {
    return this.properties.find(property => property.name === name)
  }

  retain = false

  toJSON() : UnknownObject {
    const object : UnknownObject = { id: this.id, type: this.type }
    if (this.icon) object.icon = this.icon
    if (this.label !== this.id) object.label = this.label
    return object
  }

  type! : DefinitionType

  value(name : string) : SelectionValue | undefined {
    const property = this.property(name)
    if (!property) return

    return property.value
  }
}

interface Definition extends DefinitionBase {}

type DefinitionTimes = Map<Definition, Times[]>

type DefinitionClass = Constrained<DefinitionBase>

export { Definition, DefinitionClass, DefinitionBase, DefinitionObject, DefinitionTimes }

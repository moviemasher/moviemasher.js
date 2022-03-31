import {
  Any, Constrained, Described, FilesArgs, GraphFile, GraphFileIconArgs, GraphFiles, UnknownObject
} from "../declarations"
import { DefinitionType, DefinitionTypes, GraphFileType, GraphType, LoadType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { Property } from "../Setup/Property"
import { Times } from "../Helpers/Time/Time"
import { Is, isPopulatedString } from "../Utility/Is"
import { Instance, InstanceBase, InstanceObject } from "./Instance"
import { SelectionValue } from "./Propertied"
import { Factory } from "../Definitions/Factory/Factory"

export class DefinitionBase {
  constructor(...args: Any[]) {
    const [object] = args
    const { id, label, icon } = object as DefinitionObject
    if (!(id && Is.populatedString(id))) throw Errors.invalid.definition.id

    this.id = id
    this.label = label || id
    if (icon) this.icon = icon
  }

  definitionFiles(_args: FilesArgs): GraphFiles { return [] }

  // graphFileIcon(args: GraphFileIconArgs): GraphFile {
  //   const { size, mashSize } = args

  //   const { icon } = this
  //   if (icon) {
  //     const imageGraphFile: GraphFile = { type: LoadType.Image, file: icon }
  //     return imageGraphFile
  //   }
  //   const type = this.icon ?  : GraphFileType.Png
  //   const file = this.icon ? this.icon : ''
  // }
  icon?: string

  id: string

  get instance(): Instance { return this.instanceFromObject(this.instanceObject) }

  instanceFromObject(object: InstanceObject): Instance {
    return new InstanceBase({ ...this.instanceObject, ...object })
  }

  get instanceObject(): InstanceObject {
    const entries = this.properties.map(property => ([property.name, property.value]))
    return Object.fromEntries([...entries, ['definition', this]])
  }

  label: string

  properties: Property[] = []

  get propertiesModular(): Property[] {
    return this.properties.filter(property => property.type.modular)
  }

  property(name: string): Property | undefined {
    return this.properties.find(property => property.name === name)
  }

  retain = false

  toJSON(): UnknownObject {
    const object: UnknownObject = { id: this.id, type: this.type }
    if (this.icon) object.icon = this.icon
    if (this.label !== this.id) object.label = this.label
    return object
  }

  type!: DefinitionType

  value(name: string): SelectionValue | undefined { return this.property(name)?.value }

  static fromObject(object: DefinitionObject): Definition {
    const { id: definitionId, type } = object
    if (!(type && isPopulatedString(type))) throw `${Errors.type} fromObject ${definitionId}`

    const definitionType = <DefinitionType>type
    if (!DefinitionTypes.includes(definitionType)) throw `${Errors.type} fromObject ${definitionType}`

    if (!(definitionId && isPopulatedString(definitionId))) {
      throw Errors.invalid.definition.id + JSON.stringify(object)
    }
    const factory = Factory[definitionType]

    return factory.definition(object)
  }
}

export type DefinitionClass = Constrained<DefinitionBase>
export interface Definition extends DefinitionBase {}
export type DefinitionTimes = Map<Definition, Times[]>

export interface DefinitionObject extends UnknownObject, Partial<Described> {
  source?: string
  type?: DefinitionType | string
  url?: string
}
export type DefinitionObjects = DefinitionObject[]

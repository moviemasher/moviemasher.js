import { Endpoint, LoadedImage, SvgOrImage, UnknownObject } from "../declarations"
import { assertDefinitionType, DefinitionType, isDefinitionType, Orientation } from "../Setup/Enums"
import { Property } from "../Setup/Property"
import { assertPopulatedString, isPopulatedString } from "../Utility/Is"
import { Instance, InstanceObject } from "../Instance/Instance"
import { InstanceBase } from "../Instance/InstanceBase"
import { Factory } from "../Definitions/Factory/Factory"
import { Definition, DefinitionObject } from "../Definition/Definition"
import { sizeCopy, Size } from "../Utility/Size"
import { urlForEndpoint, urlHasProtocol } from "../Utility/Url"
import { svgElement, svgImageElement } from "../Utility/Svg"


export class DefinitionBase implements Definition {
  constructor(...args: any[]) {
    const [object] = args
    const { id, label, icon } = object as DefinitionObject
    assertPopulatedString(id, 'id')

    this.id = id
    if (isPopulatedString(label)) this.label = label 
    if (isPopulatedString(icon)) this.icon = icon
  }

  icon?: string

  id: string

  definitionIcon(endpoint: Endpoint, dimensions: Size): Promise<SvgOrImage> | undefined {
    const { icon } = this
    if (icon) {
      const url = urlForEndpoint(endpoint, icon)
      const image = new Image()
      image.crossOrigin = "Anonymous"

      image.src = url
      const copy = sizeCopy(dimensions)
      const key = copy.height > copy.width ? 'width' : 'height'
      image.setAttribute(key, String(copy[key]))
      return Promise.resolve(image) 
    }
  }
  
  instanceFromObject(object: InstanceObject = {}): Instance {
    return new InstanceBase({ ...this.instanceArgs(object), ...object })
  }

  instanceArgs(object: InstanceObject = {}): InstanceObject {
    const defaults = Object.fromEntries(this.properties.map(property => (
      [property.name, property.defaultValue]
    )))
    return { ...defaults, ...object, definition: this }
  }

  label = ''

  properties: Property[] = [];

  get propertiesModular(): Property[] {
    return this.properties.filter(property => isDefinitionType(property.type))
  }

  toJSON(): UnknownObject {
    const object: UnknownObject = { id: this.id, type: this.type }
    if (this.icon)
      object.icon = this.icon
    if (this.label !== this.id)
      object.label = this.label
    return object
  }

  toString(): string { return this.label }

  type!: DefinitionType

  // value(name: string): Scalar | undefined { return this.property(name)?.value }
  static fromObject(object: DefinitionObject): Definition {
    const { id, type } = object
    assertDefinitionType(type)
    assertPopulatedString(id, 'id')
    return Factory[type].definition(object)
  }

}

import { UnknownObject } from "../declarations"
import { DefinitionType } from "../Setup/Enums"
import { Property } from "../Setup/Property"
import { assertPopulatedString, isPopulatedString } from "../Utility/Is"
import { Instance, InstanceObject } from "../Instance/Instance"
import { InstanceBase } from "../Instance/InstanceBase"
import { Definition, DefinitionObject } from "../Definition/Definition"
import { Size } from "../Utility/Size"
import { Defined } from "../Base/Defined"
import { Errors } from "../Setup/Errors"


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

  definitionIcon(size: Size): Promise<SVGSVGElement> | undefined {
    throw new Error(Errors.unimplemented)
    // const { icon } = this
    // if (!icon) {
    //   // console.log(this.constructor.name, "definitionIcon NO ICON")
    //   return
    // } 
    // // console.log(this.constructor.name, "definitionIcon", icon)

    // return this.urlIcon(icon, size)
  }
  
  instanceFromObject(object: InstanceObject = {}): Instance {
    return new InstanceBase(this.instanceArgs(object))
  }

  instanceArgs(object: InstanceObject = {}): InstanceObject {
    const defaults = Object.fromEntries(this.properties.map(property => (
      [property.name, property.defaultValue]
    )))
    return { ...defaults, ...object, definition: this }
  }

  label = ''

  properties: Property[] = [];

  // get propertiesModular(): Property[] {
  //   return this.properties.filter(property => isDefinitionType(property.type))
  // }

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

  // protected urlIcon(url: string, size: Size): Promise<SVGSVGElement> | undefined {
  //   const imageUrl = urlPrependProtocol('image', url)
  //   console.log(this.constructor.name, "urlIcon", imageUrl)
  //   return svgImagePromiseWithOptions(url).then(svgImage => {

  //   })
  //   return loader.loadPromise(imageUrl, this).then((image: LoadedImage) => {
  //     console.log(this.constructor.name, "urlIcon.loadPromise", imageUrl, image?.constructor.name)
  //     const { width, height } = image
  //     const inSize = { width, height }
  //     const coverSize = sizeCover(inSize, size, true)
  //     const outRect = { ...coverSize, ...centerPoint(size, coverSize) }
  //     const svgUrl = urlPrependProtocol('svg', imageUrl, outRect)
    
  //     console.log(this.constructor.name, "urlIcon", svgUrl)
  //     return loader.loadPromise(svgUrl, this).then(svgImage => {
  //       // console.log(this.constructor.name, "urlIcon.loadPromise", svgUrl, svgImage?.constructor.name)
  //       return svgSvgElement(size, svgImage)
  //     })
  //   })
  // }

  static fromObject(object: DefinitionObject): Definition {
    const { id } = object
    assertPopulatedString(id, 'id')
    return Defined.definition(object)
  }
}

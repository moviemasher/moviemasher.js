import { LoadedImage, SvgItem, SvgOrImage, UnknownObject } from "../declarations"
import { assertDefinitionType, DefinitionType, isDefinitionType, Orientation } from "../Setup/Enums"
import { Property } from "../Setup/Property"
import { assertPopulatedString, isPopulatedString } from "../Utility/Is"
import { Instance, InstanceObject } from "../Instance/Instance"
import { InstanceBase } from "../Instance/InstanceBase"
import { Factory } from "../Definitions/Factory/Factory"
import { Definition, DefinitionObject } from "../Definition/Definition"
import { Size, sizeCover, sizeFromElement, sizeString } from "../Utility/Size"
import { BrowserLoaderClass, Loader } from "../Loader"
import { svgElement, svgSetTransformPoint } from "../Utility/Svg"
import { centerPoint, rectString } from "../Utility/Rect"
import { urlPrependProtocol } from "../Utility/Url"


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


  
  protected urlIcon(url: string, loader: Loader, size: Size): Promise<SVGSVGElement> | undefined {
    const imageUrl = urlPrependProtocol('image', url)
    // console.log(this.constructor.name, "urlIcon", imageUrl)
    return loader.loadPromise(imageUrl).then((image: LoadedImage) => {
      // console.log(this.constructor.name, "urlIcon.loadPromise", imageUrl, image?.constructor.name)
      const { width, height } = image
      const inSize = { width, height }
      const coverSize = sizeCover(inSize, size, true)
      const outRect = { ...coverSize, ...centerPoint(size, coverSize) }
      const svgUrl = urlPrependProtocol('svg', imageUrl, outRect)
    
      // console.log(this.constructor.name, "urlIcon", svgUrl)
      return loader.loadPromise(svgUrl).then(svgImage => {
        // console.log(this.constructor.name, "urlIcon.loadPromise", svgUrl, svgImage?.constructor.name)
        return svgElement(size, svgImage)
      })
    })
  }


  definitionIcon(loader: Loader, size: Size): Promise<SVGSVGElement> | undefined {
    const { icon } = this
    if (!icon) return 
    
    return this.urlIcon(icon, loader, size)
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

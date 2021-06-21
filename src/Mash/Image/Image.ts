import { GenericFactory } from "../../Setup/declarations"
import { DefinitionObject } from "../Definition/Definition"
import { Transformable, TransformableObject } from "../Mixin/Transformable/Transformable"
import { VisibleDefinition } from "../Mixin/Visible/Visible"

type ImageObject = TransformableObject

interface Image extends Transformable {
  definition : ImageDefinition
}

interface ImageDefinitionObject extends DefinitionObject {
  url? : string
  source? : string
 }

 interface ImageDefinition extends VisibleDefinition {
   instance : Image
   instanceFromObject(object : ImageObject) : Image
}

 type ImageFactory = GenericFactory<Image, ImageObject, ImageDefinition, ImageDefinitionObject>

export { Image, ImageDefinition, ImageDefinitionObject, ImageFactory, ImageObject }

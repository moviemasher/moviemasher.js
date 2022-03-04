import { PreloadableDefinition } from "../../Base/PreloadableDefinition"
import { GenericFactory } from "../../declarations"

import {
  Transformable, TransformableDefinition, TransformableDefinitionObject,
  TransformableObject
} from "../../Mixin/Transformable/Transformable"

type ImageObject = TransformableObject

interface Image extends Transformable {
  definition : ImageDefinition
}

interface ImageDefinitionObject extends TransformableDefinitionObject {
  url? : string
  source? : string
 }

 interface ImageDefinition extends TransformableDefinition, PreloadableDefinition {
   instance : Image
   instanceFromObject(object : ImageObject) : Image
}

/**
 * @category Factory
 */
interface ImageFactory extends GenericFactory<Image, ImageObject, ImageDefinition, ImageDefinitionObject> {}

export { Image, ImageDefinition, ImageDefinitionObject, ImageFactory, ImageObject }

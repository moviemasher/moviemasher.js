import { PreloadableDefinition } from "../../Base/PreloadableDefinition"
import { GenericFactory } from "../../declarations"

import {
  Transformable, TransformableDefinition, TransformableDefinitionObject,
  TransformableObject
} from "../../Mixin/Transformable/Transformable"

export type ImageObject = TransformableObject

export interface Image extends Transformable {
  definition : ImageDefinition
}

export interface ImageDefinitionObject extends TransformableDefinitionObject {
  url? : string
  source? : string
 }

export interface ImageDefinition extends TransformableDefinition, PreloadableDefinition {
  instance : Image
  instanceFromObject(object : ImageObject) : Image
}

/**
 * @category Factory
 */
export interface ImageFactory extends GenericFactory<Image, ImageObject, ImageDefinition, ImageDefinitionObject> {}

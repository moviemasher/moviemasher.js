import { ImageMediaClass } from "./ImageMediaClass"
import { Image, ImageMedia, ImageMediaObject, ImageObject } from "./Image"
import { assertPopulatedString } from "../../Utility/Is"
import { MediaFactories } from "../MediaFactories"
import { ImageType } from "../../Setup/Enums"

import defaultContent from "../../MediaObjects/content/default.json"

import defaultContainer from "../../MediaObjects/container/default.json"
import heartContainer from "../../MediaObjects/container/heart.json"
import cloudContainer from "../../MediaObjects/container/cloud.json"
import appleContainer from "../../MediaObjects/container/apple.json"
import starburstContainer from "../../MediaObjects/container/starburst.json"
import roundedRectContainer from "../../MediaObjects/container/rounded-rect.json"
import fireContainer from "../../MediaObjects/container/fire.json"
import flagContainer from "../../MediaObjects/container/flag.json"
import ovalContainer from "../../MediaObjects/container/oval.json"
import mmContainer from "../../MediaObjects/container/mm.json"
import { ShapeContainerDefinitionClass } from "../Container/ShapeContainer/ShapeContainerDefinitionClass"
import { DefaultContainerId } from "../Container/Container"
import { MediaDefaults } from "../MediaDefaults"
import { ColorContentDefinitionClass } from "../Content/ColorContent/ColorContentDefinitionClass"
import { DefaultContentId } from "../Content/Content"

export const imageDefinition = (object : ImageMediaObject) : ImageMedia => {
  const { id } = object
  assertPopulatedString(id, 'imageDefinition id')

  return new ImageMediaClass(object)
}

export const imageDefinitionFromId = (id : string) : ImageMedia => {
  const definition = MediaDefaults[ImageType].find(definition => 
    definition.id === id
  )
  if (definition) return definition as ImageMedia

  
  return imageDefinition({ id })
}

export const imageInstance = (object : ImageObject) : Image => {
  const { mediaId: id, definition: defined } = object
  const definition = defined || imageDefinitionFromId(id!)
  const instance = definition.instanceFromObject(object)
  return instance
}

export const imageFromId = (id : string) : Image => {
  return imageInstance({ id })
}


MediaFactories[ImageType] = imageDefinition

MediaDefaults[ImageType].push(
  new ColorContentDefinitionClass({id: DefaultContentId, ...defaultContent}),
  new ShapeContainerDefinitionClass({ id: DefaultContainerId, ...defaultContainer }),
  new ShapeContainerDefinitionClass(roundedRectContainer),
  new ShapeContainerDefinitionClass(ovalContainer),
  new ShapeContainerDefinitionClass(starburstContainer),
  new ShapeContainerDefinitionClass(heartContainer),
  new ShapeContainerDefinitionClass(cloudContainer),
  new ShapeContainerDefinitionClass(fireContainer),
  new ShapeContainerDefinitionClass(flagContainer),
  new ShapeContainerDefinitionClass(mmContainer),
  new ShapeContainerDefinitionClass(appleContainer),

)


import {ImageMediaClass} from './ImageMediaClass.js'
import {Image, ImageMedia, ImageMediaObject, ImageObject} from './Image.js'
import {assertPopulatedString} from '../../Utility/Is.js'
import {MediaFactories} from '../MediaFactories.js'
import {TypeImage} from '../../Setup/Enums.js'

import {ShapeContainerDefinitionClass} from '../Container/ShapeContainer/ShapeContainerDefinitionClass.js'
import {DefaultContainerId} from '../Container/ContainerConstants.js'
import {MediaDefaults} from '../MediaDefaults.js'
import {ColorContentDefinitionClass} from '../Content/ColorContent/ColorContentDefinitionClass.js'
import {DefaultContentId} from '../Content/ContentConstants.js'

export const imageDefinition = (object : ImageMediaObject) : ImageMedia => {
  const { id } = object
  assertPopulatedString(id, 'imageDefinition id')

  return new ImageMediaClass(object)
}

export const imageDefinitionFromId = (id : string) : ImageMedia => {
  const definition = MediaDefaults[TypeImage].find(definition => 
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


MediaFactories[TypeImage] = imageDefinition





MediaDefaults[TypeImage].push(
  new ColorContentDefinitionClass({
    id: DefaultContentId,
    label: "Color",
    type: "image",
    request: { response: { color: "#FFFFFF" }}
  }),
  new ShapeContainerDefinitionClass({
    id: DefaultContainerId, 
    label: "Rectangle",
    type: "image",
    request: { response: { } }
  })
)


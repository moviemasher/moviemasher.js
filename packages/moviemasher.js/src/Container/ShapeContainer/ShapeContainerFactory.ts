import { DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { assertPopulatedString } from "../../Utility/Is"
import { Factories } from "../../Definitions/Factories"
import { ShapeContainerDefinitionClass } from "./ShapeContainerDefinitionClass"
import { ShapeContainer, ShapeContainerDefinition, ShapeContainerDefinitionObject, ShapeContainerObject } from "./ShapeContainer"

import defaultShapeContainerJson from "../../Definitions/DefinitionObjects/shapecontainer/default.json"
import chatShapeContainerJson from "../../Definitions/DefinitionObjects/shapecontainer/chat.json"
import broadcastShapeContainerJson from "../../Definitions/DefinitionObjects/shapecontainer/broadcast.json"
import musicShapeContainerJson from "../../Definitions/DefinitionObjects/shapecontainer/music.json"
import testShapeContainerJson from "../../Definitions/DefinitionObjects/shapecontainer/test.json"

export const shapeContainerDefault = new ShapeContainerDefinitionClass(defaultShapeContainerJson)
export const shapeContainerDefaults = [
  shapeContainerDefault,
  new ShapeContainerDefinitionClass(chatShapeContainerJson),
  new ShapeContainerDefinitionClass(broadcastShapeContainerJson),
  new ShapeContainerDefinitionClass(musicShapeContainerJson),
  new ShapeContainerDefinitionClass(testShapeContainerJson),
]

export const shapeContainerDefinition = (object : ShapeContainerDefinitionObject) : ShapeContainerDefinition => {
  const { id } = object
  assertPopulatedString(id, 'shapeContainerDefinition id')

  return new ShapeContainerDefinitionClass({ ...object, type: DefinitionType.ShapeContainer })
}

export const shapeContainerDefinitionFromId = (id: string): ShapeContainerDefinition => {
  const definition = shapeContainerDefaults.find(definition => definition.id === id)
  if (definition) return definition

  return shapeContainerDefinition({ id })
}

export const shapeContainerInstance = (object: ShapeContainerObject): ShapeContainer => {
  const { definitionId } = object
  if (!definitionId) throw Errors.id

  const definition = shapeContainerDefinitionFromId(definitionId)
  const instance = definition.instanceFromObject(object)
  return instance
}

export const shapeContainerFromId = (id: string): ShapeContainer => {
  const definition = shapeContainerDefinitionFromId(id)
  const instance = definition.instanceFromObject({ definitionId: id })
  return instance
}

Factories[DefinitionType.ShapeContainer] = {
  definition: shapeContainerDefinition,
  definitionFromId: shapeContainerDefinitionFromId,
  fromId: shapeContainerFromId,
  instance: shapeContainerInstance,
  defaults: shapeContainerDefaults,
}

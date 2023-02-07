import { assertPopulatedString } from "../../Utility/Is"
import { SequenceMediaClass } from "./SequenceMediaClass"
import { Sequence, SequenceDefinition, SequenceDefinitionObject, SequenceObject } from "./Sequence"
import { DefinitionType } from "../../Setup/Enums"
import { MediaFactories } from "../MediaFactories"

export const sequenceDefinition = (object : SequenceDefinitionObject) : SequenceDefinition => {
  const { id } = object
  assertPopulatedString(id)

  return new SequenceMediaClass(object)
}

export const sequenceDefinitionFromId = (id : string) : SequenceDefinition => {
  return sequenceDefinition({ id })
}

export const sequenceInstance = (object : SequenceObject) : Sequence => {
  const definition = sequenceDefinition(object)
  return definition.instanceFromObject(object)
}

export const sequenceFromId = (id : string) : Sequence => {
  return sequenceInstance({ id })
}

MediaFactories[DefinitionType.Sequence] = sequenceDefinition

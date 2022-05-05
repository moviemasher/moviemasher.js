import { Definition, DefinitionObject, DefinitionObjects } from "../../Base/Definition"
import { DefinitionType } from "../../Setup/Enums"


export interface EditorDefinitions {
  byType(type: DefinitionType): Definition[]
  define(objectOrArray: DefinitionObject | DefinitionObjects): void
  fromId(id: string): Definition
  install(definition: Definition): void
  installed(id: string): boolean
  ids: string[]
  toJSON(): DefinitionObjects
}

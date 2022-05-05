
import { Definition, DefinitionObject, DefinitionObjects } from "../../Base/Definition"
import { Factory } from "../../Definitions/Factory"
import { DefinitionType, DefinitionTypeStrings } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { EditorDefinitions } from "./EditorDefinitions"

const EditorDefinitionsType = (id: string): DefinitionType | undefined => {
  if (id.startsWith('com.moviemasher.')) {
    return id.split('.')[2] as DefinitionType
  }
  return undefined
}

export class EditorDefinitionsClass implements EditorDefinitions {
  constructor(objectOrArray?: DefinitionObject | DefinitionObjects) {
    if (objectOrArray) this.define(objectOrArray)
  }
  private definitionsByType = new Map<DefinitionType, Definition[]>()

  define(objectOrArray: DefinitionObject | DefinitionObjects) {
    const objects = Array.isArray(objectOrArray) ? objectOrArray : [objectOrArray]
    objects.forEach(object => {
      const { id, type } = object
      if (!id) throw Errors.invalid.definition.id
      if (!(type && DefinitionTypeStrings.includes(type))) throw Errors.invalid.definition.type + type

      const definitionType = type as DefinitionType
      const definition = Factory[definitionType].definition(object)
      this.install(definition)
    })
  }

  byType(type: DefinitionType): Definition[] {
    const list = this.definitionsByType.get(type)
    if (list) return list

    const definitionsList: Definition[] = []
    this.definitionsByType.set(type, definitionsList)
    return definitionsList
  }

  definitionsClear(): void {
    this.byId.clear()
    this.definitionsByType.clear()
  }

  fromId(id: string): Definition {
    if (this.installed(id)) return this.byId.get(id)!

    const definitionType = EditorDefinitionsType(id)
    if (!definitionType) throw Errors.invalid.definition.type + id

    return Factory[definitionType].definitionFromId(id)
  }

  install(definition: Definition): void {
    const { type, id } = definition
    const array = this.byType(type)
    if (this.installed(id)) this.deleteDefinition(definition)
    this.byId.set(id, definition)
    array.push(definition)
  }

  installed(id: string): boolean { return this.byId.has(id) }

  byId = new Map<string, Definition>()

  definitionUninstall(id: string): void {
    if (!this.installed(id)) return

    const definition = this.fromId(id)
    this.byId.delete(id)
    this.deleteDefinition(definition)
  }

  private deleteDefinition(definition: Definition): void {
    const { type } = definition
    const definitions = this.byType(type)
    const index = definitions.indexOf(definition)
    if (index < 0) throw Errors.internal + 'definitionUninstall'

    definitions.splice(index, 1)
  }

  get ids(): string[] { return [...this.byId.keys()] }

  toJSON(): DefinitionObjects {
    return [...this.byId.values()].map(definition => definition.toJSON())
  }
}

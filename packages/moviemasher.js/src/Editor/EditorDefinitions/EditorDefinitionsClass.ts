import { Definition, DefinitionObject, DefinitionObjects } from "../../Base/Definition"
import { Factory } from "../../Definitions/Factory"
import { assertDefinitionType, DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { assertPopulatedString } from "../../Utility/Is"
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

  byId = new Map<string, Definition>()

  private byIdAdd(definition: Definition | Definition[]) {
    const definitions = Array.isArray(definition) ? definition : [definition]
    definitions.forEach(definition => this.byId.set(definition.id, definition))
  }

  byType(type: DefinitionType): Definition[] {
    const list = this.definitionsByType.get(type)
    if (list) return list

    const definitions = Factory[type].defaults || []
    this.definitionsByType.set(type, definitions)
    // this.byIdAdd(definitions)
    return definitions
  }

  define(objectOrArray: DefinitionObject | DefinitionObjects) {
    const objects = Array.isArray(objectOrArray) ? objectOrArray : [objectOrArray]
    objects.forEach(object => {
      const { id, type } = object
      assertPopulatedString(id)
      assertDefinitionType(type)

      const definition = Factory[type].definition(object)
      this.install(definition)
    })
  }

  private definitionDelete(definition: Definition): void {
    const { type } = definition
    const definitions = this.byType(type)
    const index = definitions.indexOf(definition)
    if (index < 0) return

    definitions.splice(index, 1)
  }

  definitionUninstall(id: string): void {
    if (!this.installed(id)) return

    const definition = this.fromId(id)
    this.byId.delete(id)
    this.definitionDelete(definition)
  }

  private definitionsByType = new Map<DefinitionType, Definition[]>()

  fromId(id: string): Definition {
    if (this.installed(id)) return this.byId.get(id)!

    const definitionType = EditorDefinitionsType(id)
    if (!definitionType) {
      console.trace(Errors.invalid.definition.id, id)
      throw Errors.invalid.definition.id + id
    }
    return Factory[definitionType].definitionFromId(id)
  }

  get ids(): string[] { return [...this.byId.keys()] }

  install(definition: Definition): void {
    const { type, id } = definition
    if (this.installed(id)) this.definitionDelete(definition)

    this.byIdAdd(definition)
    this.byType(type).push(definition)
  }

  installed(id: string): boolean { return this.byId.has(id) }

  toJSON(): DefinitionObjects {
    return [...this.byId.values()].map(definition => definition.toJSON())
  }
}

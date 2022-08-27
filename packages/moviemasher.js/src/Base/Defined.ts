import { Factory } from "../Definitions/Factory/Factory"
import { IdPrefix } from "../Setup/Constants"
import { assertDefinitionType, DefinitionType, isDefinitionType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { assertPopulatedString, assertPositive, assertTrue } from "../Utility/Is"
import { assertDefinition, Definition, DefinitionObject, DefinitionObjects } from "../Definition/Definition"

export class Defined {
  static byId = new Map<string, Definition>()

  private static byIdAdd(definition: Definition | Definition[]) {
    const definitions = Array.isArray(definition) ? definition : [definition]
    definitions.forEach(definition => this.byId.set(definition.id, definition))
  }

  static byType(type: DefinitionType): Definition[] {
    const list = this.definitionsByType.get(type)
    if (list) return list

    const definitions = Factory[type].defaults || []
    this.definitionsByType.set(type, definitions)
    // this.byIdAdd(definitions)
    return definitions
  }

  static define(...objects: DefinitionObjects) : Definition[] {
    return objects.map(object => this.fromObject(object))
  }

  private static definitionDelete(definition: Definition): void {
    const { type } = definition
    const definitions = this.byType(type)
    const index = definitions.indexOf(definition)
    if (index < 0) return

    definitions.splice(index, 1)
  }

  static definitionUninstall(id: string): void {
    if (!this.installed(id)) return

    const definition = this.fromId(id)
    this.byId.delete(id)
    this.definitionDelete(definition)
  }

  private static definitionsByType = new Map<DefinitionType, Definition[]>()

  private static definitionsType(id: string): DefinitionType | undefined {
    const type = id.split('.').slice(-2).shift()
    return isDefinitionType(type) ? type : undefined
  }

  static fromId(id: string): Definition {
    if (this.installed(id)) return this.byId.get(id)!

    const definitionType = this.definitionsType(id)
    assertDefinitionType(definitionType, `in Defined.fromId('${id}')`)

    return Factory[definitionType].definitionFromId(id)
  }

  static fromObject(object: DefinitionObject): Definition {
    const { id, type } = object
    assertPopulatedString(id)

    if (this.installed(id) || this.predefined(id)) return this.fromId(id)

    const definitionType = type || this.definitionsType(id)
    assertDefinitionType(definitionType)

    return this.install(Factory[definitionType].definition(object))
  }

  static get ids(): string[] { return [...this.byId.keys()] }

  static install(definition: Definition): Definition {
    const { type, id } = definition
    if (this.installed(id)) {
      this.uninstall(definition)
      return this.updateDefinition(this.fromId(id), definition)
    }

    this.byIdAdd(definition)
    this.byType(type).push(definition)
    return definition
  }

  static installed(id: string): boolean { return this.byId.has(id) }

  static predefined(id: string) { return id.startsWith(IdPrefix) }

  static undefineAll() {
    // console.log(this.name, "undefineAll")
    // TODO: be more graceful - tell definitions they are being destroyed...
    this.byId = new Map<string, Definition>()
    this.definitionsByType = new Map<DefinitionType, Definition[]>()
  }

  static updateDefinition(oldDefinition: Definition, newDefinition: Definition): Definition {
    this.uninstall(oldDefinition)
    this.install(newDefinition)
    return newDefinition
  }

  static updateDefinitionId(oldId: string, newId: string) {
    const definition = this.byId.get(oldId)
    assertDefinition(definition)

    this.byId.delete(oldId)
    this.byId.set(newId, definition)
  }

  static uninstall(definition: Definition) {
    const { type, id } = definition
    const list = this.definitionsByType.get(type)
    assertTrue(list)
    const index = list.indexOf(definition)
    assertPositive(index)

    list.splice(index, 1)
    this.byId.delete(id)
    return definition
  }
  
}

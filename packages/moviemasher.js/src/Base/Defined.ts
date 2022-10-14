import { Factory } from "../Definitions/Factory/Factory"
import { IdPrefix } from "../Setup/Constants"
import { assertDefinitionType, DefinitionType, isDefinitionType } from "../Setup/Enums"
import { assertPopulatedString } from "../Utility/Is"
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
    const { type, id } = definition
    const definitions = this.byType(type)
    const index = definitions.findIndex(definition => id === definition.id)
    // console.log(this.name, "definitionDelete", type, id, index)
    if (index < 0) return

    definitions.splice(index, 1)
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
    // console.log(this.name, "install", JSON.stringify(definition))

    if (this.installed(id)) {
      // console.log(this.constructor.name, "install REINSTALL", type, id)
      this.uninstall(definition)
      return this.updateDefinition(this.fromId(id), definition)
    }

    // console.log(this.constructor.name, "install", type, id)

    this.byIdAdd(definition)
    this.byType(type).push(definition)
    return definition
  }

  static installed(id: string): boolean { return this.byId.has(id) }

  static predefined(id: string) { 
    if (id.startsWith(IdPrefix)) return true

    const definitionType = this.definitionsType(id)
    if (!definitionType) return false

    const array = this.byType(definitionType)
    return array.some(definition => definition.id === id)
  }

  static undefineAll() {
    // console.log(this.name, "undefineAll")
    // TODO: be more graceful - tell definitions they are being destroyed...
    this.byId = new Map<string, Definition>()
    this.definitionsByType = new Map<DefinitionType, Definition[]>()
  }

  static updateDefinition(oldDefinition: Definition, newDefinition: Definition): Definition {
    // console.log(this.name, "updateDefinition", oldDefinition.type, oldDefinition.id, "->", newDefinition.type, newDefinition.id)

    this.uninstall(oldDefinition)
    this.install(newDefinition)
    return newDefinition
  }

  static updateDefinitionId(oldId: string, newId: string) {
    // console.log(this.name, "updateDefinitionId", oldId, "->", newId)

    const definition = this.byId.get(oldId)
    assertDefinition(definition)

    this.byId.delete(oldId)
    this.byId.set(newId, definition)
  }

  static uninstall(definition: Definition) {
    this.definitionDelete(definition)
    const { id } = definition
    this.byId.delete(id)
    return definition
  }
  
}

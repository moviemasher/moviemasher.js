import { IdPrefix } from "../Setup/Constants"
import { assertDefinitionType, ModuleDefinitionType, isModuleDefinitionType, assertModuleDefinitionType } from "../Setup/Enums"
import { assertPopulatedString } from "../Utility/Is"
import { moduleDefinition } from "../Module/ModuleFactory"
import { ModuleDefaults } from "../Module/ModuleDefaults"
import { assertDefinition, Definition, DefinitionObject, DefinitionObjects, Definitions } from "../Definition/Definition"

export class DefinedDefinitions {
  static byId = new Map<string, Definition>()

  private static byIdAdd(definition: Definition | Definitions) {
    const definitions = Array.isArray(definition) ? definition : [definition]
    definitions.forEach(definition => this.byId.set(definition.id, definition))
  }

  static byType(type: ModuleDefinitionType): Definitions {
    const list = this.definitionsByType.get(type)
    if (list) return list

    const isModule = isModuleDefinitionType(type)
    const definitions = isModule ? ModuleDefaults[type] : ModuleDefaults[type]
    this.definitionsByType.set(type, definitions)
    return definitions
  }

  static define(...objects: DefinitionObjects) : Definitions {
    return objects.map(object => this.fromObject(object))
  }

  static definition(object: DefinitionObject): Definition {
    const { type } = object
    assertDefinitionType(type)
    if (isModuleDefinitionType(type)) return moduleDefinition(object)

    return moduleDefinition(object)
  }

  private static definitionDelete(definition: Definition): void {
    const { type, id } = definition
    assertModuleDefinitionType(type)

    const definitions = this.byType(type)
    const index = definitions.findIndex(definition => id === definition.id)
    // console.log(this.name, "definitionDelete", type, id, index)
    if (index < 0) return

    definitions.splice(index, 1)
  }

  private static definitionsByType = new Map<ModuleDefinitionType, Definitions>()

  private static definitionsType(id: string): ModuleDefinitionType | undefined {
    const type = id.split('.').slice(-2).shift()
    return isModuleDefinitionType(type) ? type : undefined
  }

  static fromId(id: string): Definition {
    if (this.installed(id)) return this.byId.get(id)!

    const definitionType = this.definitionsType(id)
    assertDefinitionType(definitionType, `in Defined.fromId('${id}')`)

    const found = this.byType(definitionType).find(definition => definition.id === id)
    assertDefinition(found, id)
    return found
  }

  static fromObject(object: DefinitionObject): Definition {
    const { id, type } = object
    assertPopulatedString(id)

    if (this.installed(id) || this.predefined(id)) return this.fromId(id)

    const definitionType = type || this.definitionsType(id)
    assertDefinitionType(definitionType)
    object.type = definitionType
    return this.install(this.definition(object))
  }

  static get ids(): string[] { return [...this.byId.keys()] }

  static install(definition: Definition): Definition {
    const { type, id } = definition
    // console.log(this.name, "install", definition.label)

    if (this.installed(id)) {
      // console.log(this.constructor.name, "install REINSTALL", type, id)
      this.uninstall(definition)
      return this.updateDefinition(this.fromId(id), definition)
    }

    // console.log(this.constructor.name, "install", type, id)
    assertModuleDefinitionType(type)
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
    this.definitionsByType = new Map<ModuleDefinitionType, Definitions>()
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
    assertDefinition(definition, 'definition')

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

import { IdPrefix } from "../Setup/Constants"
import { assertDefinitionType, MediaDefinitionType, isModuleDefinitionType, ModuleDefinitionType, isMediaDefinitionType } from "../Setup/Enums"
import { assertPopulatedString } from "../Utility/Is"
import { assertMedia, Media, MediaObject, MediaObjects, Medias } from "../Media/Media"
import { mediaDefinition } from "../Media/MediaFactory"
import { ModuleDefaults } from "../Module/ModuleDefaults"
import { MediaDefaults } from "../Media/MediaDefaults"


export class Defined {
  static byId = new Map<string, Media>()

  private static byIdAdd(definition: Media | Medias) {
    const definitions = Array.isArray(definition) ? definition : [definition]
    definitions.forEach(definition => this.byId.set(definition.id, definition))
  }

  static byType(type: MediaDefinitionType): Medias {
    const list = this.definitionsByType.get(type)
    if (list) return list

    const isModule = isModuleDefinitionType(type)
    const definitions = isModule ? ModuleDefaults[type] : MediaDefaults[type]
    this.definitionsByType.set(type, definitions)
    return definitions
  }

  static define(...objects: MediaObjects) : Medias {
    return objects.map(object => this.fromObject(object))
  }

  static definition(object: MediaObject): Media {
    const { type } = object
    assertDefinitionType(type)

    return mediaDefinition(object)
  }

  private static definitionDelete(definition: Media): void {
    const { type, id } = definition
    const definitions = this.byType(type)
    const index = definitions.findIndex(definition => id === definition.id)
    // console.log(this.name, "definitionDelete", type, id, index)
    if (index < 0) return

    definitions.splice(index, 1)
  }

  private static definitionsByType = new Map<MediaDefinitionType, Medias>()

  private static definitionsType(id: string): MediaDefinitionType | undefined {
    const type = id.split('.').slice(-2).shift()
    return isMediaDefinitionType(type) ? type : undefined
  }

  static fromId(id: string): Media {
    if (this.installed(id)) return this.byId.get(id)!

    const definitionType = this.definitionsType(id)
    assertDefinitionType(definitionType, `in Defined.fromId('${id}')`)

    const found = this.byType(definitionType).find(definition => definition.id === id)
    assertMedia(found, id)
    return found
  }

  static fromObject(object: MediaObject): Media {
    const { id, type } = object
    assertPopulatedString(id)

    if (this.installed(id) || this.predefined(id)) return this.fromId(id)

    const definitionType = type || this.definitionsType(id)
    assertDefinitionType(definitionType)
    object.type = definitionType
    return this.install(this.definition(object))
  }

  static get ids(): string[] { return [...this.byId.keys()] }

  static install(definition: Media): Media {
    const { type, id } = definition
    // console.log(this.name, "install", definition.label)

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
    this.byId = new Map<string, Media>()
    this.definitionsByType = new Map<MediaDefinitionType, Medias>()
  }

  static updateDefinition(oldDefinition: Media, newDefinition: Media): Media {
    // console.log(this.name, "updateDefinition", oldDefinition.type, oldDefinition.id, "->", newDefinition.type, newDefinition.id)

    this.uninstall(oldDefinition)
    this.install(newDefinition)
    return newDefinition
  }

  static updateDefinitionId(oldId: string, newId: string) {
    // console.log(this.name, "updateDefinitionId", oldId, "->", newId)

    const definition = this.byId.get(oldId)
    assertMedia(definition, 'definition')

    this.byId.delete(oldId)
    this.byId.set(newId, definition)
  }

  static uninstall(definition: Media) {
    this.definitionDelete(definition)
    const { id } = definition
    this.byId.delete(id)
    return definition
  }
  
}

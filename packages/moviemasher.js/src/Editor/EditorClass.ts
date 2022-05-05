import { DataMashGetResponse, DataCastGetResponse } from "../Api"
import { DefinitionObject, DefinitionObjects } from "../Base/Definition"
import { Any } from "../declarations"
import { Factory } from "../Definitions/Factory"
import { BrowserPreloaderClass } from "../Preloader/BrowserPreloaderClass"
import { DefinitionType, DefinitionTypeStrings, MasherAction } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
// import { MasherAction, Errors, DefinitionTypes } from "../Setup"
import { EditorOptions } from "./Editor"
import { EditorDefinitionsClass } from "./EditorDefinitions/EditorDefinitionsClass"

export class EditorClass {
  constructor(...args: Any[]) {
    const [object] = args
    const { endpoint, preloader } = object as EditorOptions
    this.preloader = preloader || new BrowserPreloaderClass(endpoint)
  }
  can(action: MasherAction): boolean {
    throw Errors.unimplemented
  }
  clear(): void {
    throw Errors.unimplemented
  }

  define(objectOrArray: DefinitionObject | DefinitionObjects) {
    const objects = Array.isArray(objectOrArray) ? objectOrArray : [objectOrArray]
    objects.forEach(object => {
      const { id, type } = object
      if (!id) throw Errors.invalid.definition.id

      if (this.definitions.fromId(id)) {
        // redefining...

        return
      }
      if (!(type && DefinitionTypeStrings.includes(type))) throw Errors.invalid.definition.object
      const definitionType = type as DefinitionType
      const definition = Factory[definitionType].definition(object)
      this.definitions.install(definition)
    })
  }

  definitions = new EditorDefinitionsClass()

  loadData(data: DataMashGetResponse | DataCastGetResponse): void {
    throw Errors.unimplemented
  }

  preloader: BrowserPreloaderClass
}

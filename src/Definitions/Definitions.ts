import { DefinitionType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { Definition } from "../Base/Definition"

type DefinitionsList = Definition[]
const DefinitionsMap = new Map<string, Definition>()
const DefinitionsByType = new Map <DefinitionType, DefinitionsList>()

const definitionsByType = (type : DefinitionType) : DefinitionsList => {
  const list = DefinitionsByType.get(type)
  if (list) return list

  const definitionsList : DefinitionsList = []
  DefinitionsByType.set(type, definitionsList)
  return definitionsList
}
const definitionsClear = (): void => {
  DefinitionsMap.clear()
  DefinitionsByType.clear()
}

const definitionsFont = definitionsByType(DefinitionType.Font)

const definitionsFromId = (id : string) : Definition => {
  if (!definitionsInstalled(id)) {
    console.trace("definitionsFromId !definitionsInstalled", id)
    throw Errors.unknown.definition + id
  }

  const definition = DefinitionsMap.get(id)
  if (!definition) throw Errors.internal + id

  return definition
}

const definitionsInstall = (definition : Definition) : void => {
  const { type, id } = definition
  DefinitionsMap.set(id, definition)
  definitionsByType(type).push(definition)
}

const definitionsInstalled = (id : string) : boolean => DefinitionsMap.has(id)

const definitionsMerger = definitionsByType(DefinitionType.Merger)

const definitionsScaler = definitionsByType(DefinitionType.Scaler)

const definitionsUninstall = (id : string) : void => {
  if (!definitionsInstalled(id)) return

  const definition = definitionsFromId(id)
  DefinitionsMap.delete(id)
  const { type } = definition
  const definitions = definitionsByType(type)
  const index = definitions.indexOf(definition)
  if (index < 0) throw Errors.internal

  definitions.splice(index, 1)
}

const Definitions = {
  byType: definitionsByType,
  clear: definitionsClear,
  font: definitionsFont,
  fromId: definitionsFromId,
  install: definitionsInstall,
  installed: definitionsInstalled,
  map: DefinitionsMap,
  merger: definitionsMerger,
  scaler: definitionsScaler,
  uninstall: definitionsUninstall,
}

export {
  Definitions,
  definitionsByType,
  definitionsClear,
  definitionsFont,
  definitionsFromId,
  definitionsInstall,
  definitionsInstalled,
  DefinitionsMap,
  definitionsMerger,
  definitionsScaler,
  definitionsUninstall,
}

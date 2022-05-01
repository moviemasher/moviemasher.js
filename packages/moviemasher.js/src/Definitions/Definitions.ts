import { DefinitionType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { Definition } from "../Base/Definition"

const DefinitionsByType = new Map<DefinitionType, Definition[]>()

export const DefinitionsMap = new Map<string, Definition>()

export const definitionsByType = (type : DefinitionType) : Definition[] => {
  const list = DefinitionsByType.get(type)
  if (list) return list

  const definitionsList : Definition[] = []
  DefinitionsByType.set(type, definitionsList)
  return definitionsList
}

export const definitionsClear = (): void => {
  DefinitionsMap.clear()
  DefinitionsByType.clear()
}

export const definitionsFont = definitionsByType(DefinitionType.Font)

export const definitionsFromId = (id : string) : Definition => {
  if (!definitionsInstalled(id)) {
    console.trace("definitionsFromId !definitionsInstalled", id)
    throw Errors.unknown.definition + id
  }

  const definition = DefinitionsMap.get(id)
  if (!definition) throw Errors.internal + id

  return definition
}

export const definitionsInstall = (definition : Definition) : void => {
  const { type, id } = definition
  DefinitionsMap.set(id, definition)
  definitionsByType(type).push(definition)
}

export const definitionsInstalled = (id : string) : boolean => DefinitionsMap.has(id)

export const definitionsMerger = definitionsByType(DefinitionType.Merger)

export const definitionsScaler = definitionsByType(DefinitionType.Scaler)

export const definitionsUninstall = (id : string) : void => {
  if (!definitionsInstalled(id)) return

  const definition = definitionsFromId(id)
  DefinitionsMap.delete(id)
  const { type } = definition
  const definitions = definitionsByType(type)
  const index = definitions.indexOf(definition)
  if (index < 0) throw Errors.internal + 'definitionsUninstall'

  definitions.splice(index, 1)
}

export const Definitions = {
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

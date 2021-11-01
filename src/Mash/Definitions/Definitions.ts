import { DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Definition } from "../Definition/Definition"

type DefinitionsList = Definition[]
const definitionsMap = new Map<string, Definition>()
const DefinitionsByType = new Map <DefinitionType, DefinitionsList>()

const definitionsByType = (type : DefinitionType) : DefinitionsList => {
  const list = DefinitionsByType.get(type)
  if (list) return list

  const definitionsList : DefinitionsList = []
  DefinitionsByType.set(type, definitionsList)
  return definitionsList
}
const definitionsClear = () : void => { definitionsMap.clear() }

const definitionsFont = definitionsByType(DefinitionType.Font)

const definitionsFromId = (id : string) : Definition => {
  if (!definitionsInstalled(id)) {
    console.trace(id)
    throw Errors.unknown.definition + 'definitionsFromId ' + id
  }

  const definition = definitionsMap.get(id)
  if (!definition) throw Errors.internal

  return definition
}

const definitionsInstall = (definition : Definition) : void => {
  const { type, id } = definition
  // console.log("definitionsInstall", type, id)
  definitionsMap.set(id, definition)
  definitionsByType(type).push(definition)
}

const definitionsInstalled = (id : string) : boolean => definitionsMap.has(id)

const definitionsMerger = definitionsByType(DefinitionType.Merger)

const definitionsScaler = definitionsByType(DefinitionType.Scaler)

const definitionsUninstall = (id : string) : void => {
  if (!definitionsInstalled(id)) return

  const definition = definitionsFromId(id)
  definitionsMap.delete(id)
  const { type } = definition
  const definitions = definitionsByType(type)
  const index = definitions.indexOf(definition)
  if (index < 0) throw Errors.internal + 'definitionsUninstall'

  // console.log("definitionsUninstall", definition.label || definition.id)
  definitions.splice(index, 1)
}

const Definitions = {
  byType: definitionsByType,
  clear: definitionsClear,
  font: definitionsFont,
  fromId: definitionsFromId,
  install: definitionsInstall,
  installed: definitionsInstalled,
  map: definitionsMap,
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
  definitionsMap,
  definitionsMerger,
  definitionsScaler,
  definitionsUninstall,
}

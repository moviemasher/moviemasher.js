import { Masher, MasherDefinition, MasherDefinitionObject, MasherObject } from "./Masher"
import { Interval } from "../../declarations"
import { Errors } from "../../Setup/Errors"
import { Definitions } from "../Definitions/Definitions"
import { Factories } from "../Factories/Factories"
import { Is } from "../../Utilities/Is"
import { MasherDefinitionClass } from "./MasherDefinition"
import { Cache } from "../../Loading/Cache"
import { DefinitionType } from "../../Setup/Enums"

const MasherIntervalTics = 10 * 1000
const MasherDefaultId = "com.moviemasher.masher.default"

let MasherInterval : Interval | undefined

const MasherFactoryMashers : Masher[] = []

const addMasher = (masher : Masher) => {
  if (!MasherFactoryMashers.length) masherStart()
  MasherFactoryMashers.push(masher)
}

const masherDestroy = (masher : Masher) : void => {
  const index = MasherFactoryMashers.indexOf(masher)
  if (index < 0) return

  MasherFactoryMashers.splice(index, 1)
  if (!MasherFactoryMashers.length) masherStop()
}

const handleInterval = () => {
  const urls = MasherFactoryMashers.flatMap(masher => masher.mash.loadUrls)
  Cache.flush(urls)

  const definitions = MasherFactoryMashers.flatMap(masher => masher.mash.media)

  Definitions.map.forEach(definition => {
    if (definitions.includes(definition) || definition.retain) return

    Definitions.uninstall(definition.id)
  })
}

const masherStart = () => {
  if (MasherInterval) return

  MasherInterval = setInterval(() => handleInterval(), MasherIntervalTics)
}

const masherStop = () => {
  if (!MasherInterval) return

  clearInterval(MasherInterval)
  MasherInterval = undefined
}

const masherDefinition = (object : MasherDefinitionObject) : MasherDefinition => {
  const { id } = object
  const idString = id && Is.populatedString(id) && Definitions.installed(id) ? id : MasherDefaultId

  return <MasherDefinition> Definitions.fromId(idString)
}

const masherDefinitionFromId = (id : string) : MasherDefinition => {
  return masherDefinition({ id })
}

const masherInstance = (object: MasherObject = {}): Masher => {
  // console.log("masherInstance", object)
  const definition = masherDefinition(object)
  const instance = definition.instanceFromObject(object)
  addMasher(instance)
  return instance
}

const masherFromId = (id : string) : Masher => {
  return masherInstance({ id })
}

const masherInitialize = () : void => {
  new MasherDefinitionClass({ id: MasherDefaultId })
}

const masherDefine = (object : MasherDefinitionObject) : MasherDefinition => {
  const { id } = object
  if (!(id && Is.populatedString(id))) throw Errors.invalid.definition.id + 'masherDefine'

  Definitions.uninstall(id)
  return masherDefinition(object)
}

const MasherFactoryImplementation = {
  define: masherDefine,
  install: masherDefine,
  definition: masherDefinition,
  definitionFromId: masherDefinitionFromId,
  destroy: masherDestroy,
  fromId: masherFromId,
  initialize: masherInitialize,
  instance: masherInstance,
}

Factories[DefinitionType.Masher] = MasherFactoryImplementation

export {
  masherDefine as masherInstall,
  masherDefine,
  masherDefinition,
  masherDefinitionFromId,
  masherDestroy,
  MasherFactoryImplementation,
  masherFromId,
  masherInitialize,
  masherInstance,
}

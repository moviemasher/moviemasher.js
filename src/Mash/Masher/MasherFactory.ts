import { Masher, MasherDefinition, MasherDefinitionObject, MasherObject } from "./Masher"
import { Interval } from "../../declarations"
import { Definition, DefinitionTimes } from "../Definition/Definition"
import { Errors } from "../../Setup/Errors"
import { Definitions } from "../Definitions/Definitions"
import { Factories } from "../Factories/Factories"
import { Is } from "../../Utilities/Is"
import { MasherDefinitionClass } from "./MasherDefinition"

const MasherIntervalTics = 10 * 1000
const MasherDefaultId = "com.moviemasher.masher.default"

let MasherInterval : Interval | undefined

const mashers : Masher[] = []

const addMasher = (masher : Masher) => {
  if (!mashers.length) masherStart()
  mashers.push(masher)
}

const masherDestroy = (masher : Masher) : void => {
  const index = mashers.indexOf(masher)
  if (index < 0) return

  mashers.splice(index, 1)
  if (!mashers.length) masherStop()
}

const handleInterval = () => {
  // console.log(constructor.name, "handleInterval")
  const map = <DefinitionTimes> new Map()
  const definitions = new Set<Definition>()

  mashers.forEach(masher => {
    masher.definitions.forEach(definition => { definitions.add(definition) })

    const masherMap = masher.loadedDefinitions
    masherMap.forEach((times, definition) => {
      if (!map.has(definition)) map.set(definition, [])
      const definitionTimes = map.get(definition)
      if (!definitionTimes) throw Errors.internal

      definitionTimes.push(...times)
    })
  })
  map.forEach((times, definition) => {
    definition.unload(times)
  })

  Definitions.map.forEach(definition => {
    if (definitions.has(definition)) {
      // definition used in a masher (masher.mash.media)
      if (map.has(definition)) {
        // definition needs to be at least partially loaded
        definition.unload(map.get(definition))
      } else {
        // definition can be completely unloaded, but not uninstalled
        definition.unload()
      }
    } else {
      // definition is not used anywhere - unload, and uninstall if not retained
      definition.unload()
      if (!definition.retain) Definitions.uninstall(definition.id)
    }
  })
}

const masherStart = () => {
  // console.log(constructor.name, "masherStart")
  if (MasherInterval) return

  MasherInterval = setInterval(handleInterval, MasherIntervalTics)
}

const masherStop = () => {
  // console.log(constructor.name, "masherStop")
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

const masherInstance = (object : MasherObject = {}) : Masher => {
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

Factories.masher = MasherFactoryImplementation

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

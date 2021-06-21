import { Masher, MasherClass } from "./Masher"
import { Timeout } from "../../Setup/declarations"
import { Definition, DefinitionTimes } from "../../Mash/Definition/Definition"
import { Errors } from "../../Setup"
import { Definitions } from "../../Mash"

const MasherTypes = ["masher"]
const MasherType = Object.fromEntries(MasherTypes.map(type => [type, type]))
const INTERVAL_TICS = 10 * 1000

const classes = {
  Masher: MasherClass // Editor, Player
}

class MasherFactory {
  interval? : Timeout

  mashers : Masher[] = []

  create(object = {}) : Masher {
    const masher = new classes.Masher(object)
    this.addMasher(masher)
    return masher
  }

  addMasher(masher : Masher) {
    if (!this.mashers.length) this.start()
    this.mashers.push(masher)
  }

  destroy(masher : Masher) {
    const index = this.mashers.indexOf(masher)
    if (index < 0) return

    this.mashers.splice(index, 1)
    if (!this.mashers.length) this.stop()
  }

  handleInterval() {
    // console.log(this.constructor.name, "handleInterval")
    const map = <DefinitionTimes> new Map()
    const definitions = new Set<Definition>()

    this.mashers.forEach(masher => {
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

  start() {
    // console.log(this.constructor.name, "start")
    if (this.interval) return

    this.interval = setInterval(this.handleInterval.bind(this), INTERVAL_TICS)
  }

  stop() {
    // console.log(this.constructor.name, "stop")
    if (!this.interval) return

    clearInterval(this.interval)
    delete this.interval
  }

  get type() { return MasherType }

  get types() { return MasherTypes }
}

const MasherFactoryInstance = new MasherFactory()

export { MasherFactoryInstance as MasherFactory }

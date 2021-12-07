import { Default } from "../Setup/Default"
import { Definitions } from "../Definitions/Definitions"
import { Masher, MasherObject } from "./Masher"
import { MasherClass } from "./MasherInstance"

import { Cache } from "../Loading/Cache"
import { Interval } from "../declarations"

const MasherFactoryTics = 10 * 1000
class MasherFactoryImplementation {
  private addMasher(masher : Masher): void {
    if (!this.mashers.length) this.masherStart()
    this.mashers.push(masher)
  }

  // call when masher removed
  destroy(masher : Masher) : void {
    const index = this.mashers.indexOf(masher)
    if (index < 0) return

    this.mashers.splice(index, 1)
    if (!this.mashers.length) this.masherStop()
  }

  private handleInterval() {
    const urls = this.mashers.flatMap(masher => masher.mash.loadUrls)
    Cache.flush(urls)

    const definitions = this.mashers.flatMap(masher => masher.mash.definitions)

    Definitions.map.forEach(definition => {
      if (definitions.includes(definition) || definition.retain) return

      Definitions.uninstall(definition.id)
    })
  }

  instance(object: MasherObject = {}): Masher {
    object.autoplay ||= Default.masher.autoplay
    object.precision ||= Default.masher.precision
    object.loop ||= Default.masher.loop
    object.fps ||= Default.masher.fps
    object.volume ||= Default.masher.volume
    object.buffer ||= Default.masher.buffer
    const instance = new MasherClass(object)
    this.addMasher(instance)
    return instance
  }

  private interval : Interval | undefined

  private masherStart(): void {
    if (this.interval) return

    this.interval = setInterval(() => this.handleInterval(), MasherFactoryTics)
  }

  private masherStop(): void {
    if (!this.interval) return

    clearInterval(this.interval)
    this.interval = undefined
  }

  private mashers : Masher[] = []

}
const MasherFactory = new MasherFactoryImplementation()

export { MasherFactory }

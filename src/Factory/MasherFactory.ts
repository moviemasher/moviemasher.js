import { Masher } from "../Masher";
import { Is } from "../Utilities";
import { Factory } from "./Factory";
import { UrlsByType, Cache } from "../Loading";
import { LoadTypes } from "../Setup";

const MasherTypes = ["masher"]
const MasherType = Object.fromEntries(MasherTypes.map(type => [type, type]))
const INTERVAL_TICS = 10 * 1000

class MasherFactory extends Factory {
  interval : number

  __mashers? : Masher[]

  constructor() {
    super(Masher)
    this.install(MasherType.masher, Masher)
  }

  /**
   *
   * @param {Object} object containing options
   * @returns Masher
   */
  createFromObject(object : TypedObject) {
    const masher = super.createFromObject(object)
    if (!this.mashers.length) this.start()
    this.mashers.push(masher)
    return masher
  }

  destroy(masher) {
    const index = this.mashers.indexOf(masher)
    if (index < 0) return

    this.mashers.splice(index, 1)
    if (!this.mashers.length) this.stop()
  }
  handleInterval() {
    // console.log(this.constructor.name, "handleInterval")
    const urls = new UrlsByType
    this.mashers.forEach(masher => urls.concat(masher.urlsCached))
    const array = urls.urls
    Cache.urls().forEach(url => array.includes(url) || Cache.remove(url))
  }
  get mashers() : Masher[] {
    if (Is.undefined(this.__mashers)) this.__mashers = []
    return this.__mashers
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
    this.interval = null
  }
  get static type() { return MasherType }

  get static LoadTypes() { return MasherTypes }
}



const MasherFactoryInstance = new MasherFactory()

export { MasherFactoryInstance as MasherFactory }

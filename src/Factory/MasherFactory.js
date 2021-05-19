import { Masher } from "../Masher";
import { Is } from "../Utilities";
import { Factory } from "./Factory";
import { UrlsByType, Cache } from "../Loading";

const MasherTypes = ["masher"]
const MasherType = Object.fromEntries(MasherTypes.map(type => [type, type]))
const INTERVAL_TICS = 10 * 1000

class MasherFactory extends Factory {
  constructor() {
    super()
    this.install(MasherType.masher, Masher)
  }

  /**
   *
   * @param {Object} object containing options
   * @returns Masher
   */
  create(object = MasherType.masher) {
    const masher = super.create(object)
    if (!this.mashers.length) this.start()
    this.mashers.push(masher)
    return masher
  }
}

Object.defineProperties(MasherFactory.prototype, {
  destroy: {
    value: function(masher) {
      const index = this.mashers.indexOf(masher)
      if (index < 0) return

      this.mashers.splice(index, 1)
      if (!this.mashers.length) this.stop()
    }
  },
  handleInterval: {
    value: function() {
      // console.log(this.constructor.name, "handleInterval")
      const urls = new UrlsByType
      this.mashers.forEach(masher => urls.concat(masher.urlsCached))
      const array = urls.urls
      Cache.urls().forEach(url => array.includes(url) || Cache.remove(url))
    }
  },
  mashers: {
    get: function() {
      if (Is.undefined(this.__mashers)) this.__mashers = []
      return this.__mashers
    }
  },

  start: {
    value: function() {
      // console.log(this.constructor.name, "start")
      if (this.interval) return

      this.interval = setInterval(this.handleInterval.bind(this), INTERVAL_TICS)
    }
  },
  stop: {
    value: function() {
      // console.log(this.constructor.name, "stop")
      if (!this.interval) return

      clearInterval(this.interval)
      this.interval = null
    }
  },
  type: { value: MasherType },
  types: { value: MasherTypes },
})

const MasherFactoryInstance = new MasherFactory

export { MasherFactoryInstance as MasherFactory }

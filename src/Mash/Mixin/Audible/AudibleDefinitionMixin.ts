import { DataType } from "../../../Setup/Enums"
import { Any, Constrained, JsonObject, LoadPromise } from "../../../Setup/declarations"
import { Errors } from "../../../Setup/Errors"
import { AudibleDefinitionObject } from "./Audible"
import { ClipDefinition } from "../Clip/Clip"
import { Property } from "../../../Setup/Property"
import { Time, Times } from "../../../Utilities/Time"
import { Cache } from "../../../Loading"
import { LoaderFactory } from "../../../Loading/LoaderFactory"

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function AudibleDefinitionMixin<TBase extends Constrained<ClipDefinition>>(Base: TBase) {
  return class extends Base {
    constructor(...args : Any[]) {
      super(...args)
      const [object] = args
      const { loops, duration, url, audio, source, waveform } = <AudibleDefinitionObject> object
      if (!duration) throw Errors.invalid.definition.duration

      this.duration = Number(duration)

      const urlAudible = audio || url || source || ""
      if (!urlAudible) throw Errors.invalid.definition.audio

      this.urlAudible = urlAudible

      if (loops) this.loops = !!loops
      if (source) this.source = source
      if (waveform) this.waveform = waveform

      this.properties.push(new Property({ name: "gain", type: DataType.Number, value: 1.0 }))
      this.properties.push(new Property({ name: "trim", type: DataType.Integer, value: 0 }))
    }

    audible = true

    load(start : Time, end? : Time) : LoadPromise {
      const promises = [super.load(start, end)]
      if (end) {
        if (Cache.cached(this.urlAudible)) {
          const cached = Cache.get(this.urlAudible)
          if (cached instanceof Promise) promises.push(cached)
        } else promises.push(LoaderFactory.audio().loadUrl(this.urlAudible))
      }
      return Promise.all(promises).then()
    }
    loaded(start : Time, end? : Time) : boolean {
      return super.loaded(start, end) && Cache.cached(this.urlAudible)
    }

    loadedAudible(_time?: Time) : AudioBuffer | undefined {
      return Cache.get(this.urlAudible)
    }

    loops = false

    source? : string

    toJSON() : JsonObject {
      const object = super.toJSON()
      object.duration = this.duration
      object.audio = this.urlAudible
      if (this.loops) object.loops = true
      if (this.source) object.source = this.source
      if (this.waveform) object.waveform = this.waveform
      return object
    }

    unload(times : Times[] = []) : void {
      super.unload(times)
      if (times.length && times.some(maybePair => maybePair.length === 2)) {
        return // don't unload if any times indicate audio needed
      }
      if (!Cache.cached(this.urlAudible)) return

      Cache.remove(this.urlAudible)
    }

    urlAudible : string

    waveform? : string
  }
}

export { AudibleDefinitionMixin }

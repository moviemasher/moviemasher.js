import { Any, UnknownObject, LoadPromise, AudibleSource, LoadedAudio } from "../../declarations"
import { DataType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { AudibleDefinitionClass, AudibleDefinitionObject } from "./Audible"
import { ClipDefinitionClass } from "../Clip/Clip"
import { Property } from "../../Setup/Property"
import { Time, Times } from "../../Helpers/Time"
import { cacheAudibleContext, cacheCached, cacheCaching, cacheGet, cacheRemove } from "../../Loader/Cache"
import { LoaderFactory } from "../../Loader/LoaderFactory"
import { urlAbsolute } from "../../Utilities/Url"

function AudibleDefinitionMixin<T extends ClipDefinitionClass>(Base: T) : AudibleDefinitionClass & T {
  return class extends Base {
    constructor(...args: Any[]) {
      super(...args)
      const [object] = args
      const { stream, url, audio, source, waveform } = <AudibleDefinitionObject>object

      const urlAudible = audio || url || source || ""
      if (!urlAudible) throw Errors.invalid.definition.audio

      this.urlAudible = urlAudible

      if (stream) this.stream = true
      this.source = source || urlAudible
      if (waveform) this.waveform = waveform

      this.properties.push(new Property({ name: "gain", type: DataType.Number, value: 1.0 }))
    }

    get absoluteUrl(): string { return urlAbsolute(this.urlAudible) }

    audible = true

    get inputSource(): string { return urlAbsolute(this.source) }

    loadDefinition(_quantize: number, _start: Time, end?: Time): LoadPromise | void {
      if (!end) return

      const url = this.absoluteUrl
      if (cacheCached(url)) return

      if (cacheCaching(url)) return cacheGet(url)

      return LoaderFactory.audio().loadUrl(url)
    }

    definitionUrls() : string[] { return [this.absoluteUrl] }

    loadedAudible(): AudibleSource | undefined {

      const cached: LoadPromise | LoadedAudio | undefined = cacheGet(this.absoluteUrl)
      if (!cached || cached instanceof Promise) return

      // console.debug(this.constructor.name, "loadedAudible", cached.constructor.name)
      return cacheAudibleContext.createBufferSource(cached)
    }

    loops = false

    source : string

    stream = false

    toJSON() : UnknownObject {
      const object = super.toJSON()
      object.audio = this.urlAudible
      if (this.source) object.source = this.source
      if (this.waveform) object.waveform = this.waveform
      return object
    }

    unload(times : Times[] = []) : void {
      super.unload(times)
      if (times.length && times.some(maybePair => maybePair.length === 2)) {
        return // don't unload if any times indicate audio needed
      }
      if (!cacheCached(this.absoluteUrl)) return

      cacheRemove(this.absoluteUrl)
    }

    urlAudible : string

    waveform? : string
  }
}

export { AudibleDefinitionMixin }

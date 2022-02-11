import { Any, UnknownObject, AudibleSource, LoadedAudio, GraphFile, FilesArgs } from "../../declarations"
import { AVType, DataType, GraphType, LoadType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { AudibleDefinitionClass, AudibleDefinitionObject } from "./Audible"
import { ClipDefinitionClass } from "../Clip/Clip"
import { Property } from "../../Setup/Property"
import { urlAbsolute } from "../../Utility/Url"
import { AudibleContextInstance } from "../../Context/AudibleContext"
import { Preloader } from "../../Preloader/Preloader"

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

    definitionUrls() : string[] { return [this.absoluteUrl] }

    files(args: FilesArgs): GraphFile[] {
      const { avType, graphType, end } = args
      if (avType === AVType.Video) return []
      if (graphType === GraphType.Canvas && !end) return []

      const graphFile: GraphFile = { type: LoadType.Audio, file: this.urlAudible }
      return [graphFile]
    }

    get inputSource(): string { return this.source }

    loadedAudible(preloader: Preloader): AudibleSource | undefined {
      const graphFile: GraphFile = { file: this.urlAudible, type: LoadType.Audio }
      if (!preloader.loadedFile(graphFile)) return
      const cached: LoadedAudio = preloader.getFile(graphFile)
      if (!cached) return

      // console.debug(this.constructor.name, "loadedAudible", cached.constructor.name)
      return AudibleContextInstance.createBufferSource(cached)
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

    urlAudible : string

    waveform? : string
  }
}

export { AudibleDefinitionMixin }

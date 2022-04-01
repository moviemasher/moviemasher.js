import {
  Any, UnknownObject, AudibleSource, LoadedAudio, GraphFile, FilesArgs, GraphFiles
} from "../../declarations"
import { AVType, DataType, GraphType, LoadType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { AudibleDefinition, AudibleDefinitionClass, AudibleDefinitionObject } from "./Audible"
import { ClipDefinitionClass } from "../Clip/Clip"
import { Property } from "../../Setup/Property"
import { AudibleContextInstance } from "../../Context/AudibleContext"
import { Preloader } from "../../Preloader/Preloader"

function AudibleDefinitionMixin<T extends ClipDefinitionClass>(Base: T) : AudibleDefinitionClass & T {
  return class extends Base implements AudibleDefinition {
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

    audible = true

    definitionFiles(args: FilesArgs): GraphFiles {
      const { avType, graphType, time } = args
      if (avType === AVType.Video) return []
      if (graphType === GraphType.Canvas && !time.isRange) return []

      const graphFile: GraphFile = {
        type: LoadType.Audio, file: this.urlAudible, definition: this, input: true,
      }
      return [graphFile]
    }

    audibleSource(preloader: Preloader): AudibleSource | undefined {
      const graphFile: GraphFile = {
        file: this.urlAudible, type: LoadType.Audio, definition: this, input: true
      }
      if (!preloader.loadedFile(graphFile)) return
      const cached: LoadedAudio = preloader.getFile(graphFile)
      if (!cached) return

      return AudibleContextInstance.createBufferSource(cached)
    }

    loadType = LoadType.Audio

    loops = false

    source : string

    stream = false

    toJSON() : UnknownObject {
      const object = super.toJSON()
      object.audio = this.urlAudible
      if (this.waveform) object.waveform = this.waveform
      return object
    }

    urlAudible : string

    waveform? : string
  }
}

export { AudibleDefinitionMixin }

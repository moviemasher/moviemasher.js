import { AudioType } from "../../Setup/Enums"
import { AudioClass } from "./AudioClass"
import { Audio, AudioMedia, AudioObject } from "./Audio"
import { UpdatableDurationDefinitionMixin } from "../../Mixin/UpdatableDuration/UpdatableDurationDefinitionMixin"
import { TweenableDefinitionMixin } from "../../Mixin/Tweenable/TweenableDefinitionMixin"
import { ContentDefinitionMixin } from "../Content/ContentDefinitionMixin"
import { MediaBase } from "../MediaBase"
import { PreloadArgs } from "../../Base/Code"
import { requestAudioPromise } from "../../Helpers/Request/RequestFunctions"
import { errorThrow } from "../../Helpers/Error/ErrorFunctions"
import { isDefiniteError } from "../../Utility/Is"


const AudioMediaWithTweenable = TweenableDefinitionMixin(MediaBase)
const AudioMediaWithContent = ContentDefinitionMixin(AudioMediaWithTweenable)
const AudioMediaWithUpdatableDuration = UpdatableDurationDefinitionMixin(AudioMediaWithContent)
export class AudioMediaClass extends AudioMediaWithUpdatableDuration implements AudioMedia {
  instanceFromObject(object: AudioObject = {}) : Audio {
    return new AudioClass(this.instanceArgs(object))
  }

  loadPromise(args: PreloadArgs): Promise<void> {
    const { editing, audible } = args
    if (!audible) return Promise.resolve()

    const { loadedAudio } = this
    if (loadedAudio) return Promise.resolve()


    const transcoding = editing ? this.preferredTranscoding(AudioType) : this
    
    const { request } = transcoding
    return requestAudioPromise(request).then(orError => {
      if (isDefiniteError(orError)) return errorThrow(orError.error)

      const { data: clientAudio } = orError
      this.loadedAudio = clientAudio
    })
  }

  type = AudioType 
}

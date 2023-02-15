import { AudioType } from "../../Setup/Enums"
import { AudioClass } from "./AudioClass"
import { Audio, AudioMedia, AudioMediaObject, AudioObject } from "./Audio"
import { UpdatableDurationDefinitionMixin } from "../../Mixin/UpdatableDuration/UpdatableDurationDefinitionMixin"
import { TweenableDefinitionMixin } from "../../Mixin/Tweenable/TweenableDefinitionMixin"
import { ContentDefinitionMixin } from "../Content/ContentDefinitionMixin"
import { MediaBase } from "../MediaBase"
import { ClientAudio } from "../../ClientMedia/ClientMedia"
import { PreloadArgs } from "../../Base/Code"
import { requestAudioPromise } from "../../Utility/Request"


const AudioMediaWithTweenable = TweenableDefinitionMixin(MediaBase)
const AudioMediaWithContent = ContentDefinitionMixin(AudioMediaWithTweenable)
const AudioMediaWithUpdatableDuration = UpdatableDurationDefinitionMixin(AudioMediaWithContent)
export class AudioMediaClass extends AudioMediaWithUpdatableDuration implements AudioMedia {
  constructor(object: AudioMediaObject) {
    super(object)
    const { clientMedia } = this
    if (clientMedia) {
      this.loadedAudio = clientMedia as ClientAudio
    }
  }

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
      const { clientAudio: audio } = orError
      this.loadedAudio = audio
    })
  }

  type = AudioType 
}

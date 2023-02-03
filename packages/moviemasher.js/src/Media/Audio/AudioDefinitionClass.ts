import { DefinitionType, LoadType, MediaDefinitionType } from "../../Setup/Enums"
import { AudioClass } from "./AudioClass"
import { Audio, AudioDefinition, AudioDefinitionObject, AudioObject } from "./Audio"
import { PreloadableDefinitionMixin } from "../../Mixin/Preloadable/PreloadableDefinitionMixin"
import { UpdatableDurationDefinitionMixin } from "../../Mixin/UpdatableDuration/UpdatableDurationDefinitionMixin"
import { TweenableDefinitionMixin } from "../../Mixin/Tweenable/TweenableDefinitionMixin"
import { ContentDefinitionMixin } from "../Content/ContentDefinitionMixin"
import { MediaBase } from "../MediaBase"
import { LoadedAudio } from "../../declarations"
import { PreloadArgs } from "../../MoveMe"
import { requestAudioPromise } from "../../Utility/Request"


const AudioDefinitionWithTweenable = TweenableDefinitionMixin(MediaBase)
const AudioDefinitionWithContent = ContentDefinitionMixin(AudioDefinitionWithTweenable)
const AudioDefinitionWithPreloadable = PreloadableDefinitionMixin(AudioDefinitionWithContent)
const AudioDefinitionWithUpdatableDuration = UpdatableDurationDefinitionMixin(AudioDefinitionWithPreloadable)
export class AudioDefinitionClass extends AudioDefinitionWithUpdatableDuration implements AudioDefinition {
  constructor(object: AudioDefinitionObject) {
    super(object)
    const { loadedMedia } = this
    if (loadedMedia) {
      this.loadedAudio = loadedMedia as LoadedAudio
    }
    
    const { audioUrl, url } = object 
    if (!audioUrl && url) this.audioUrl = url
  }

  instanceFromObject(object: AudioObject = {}) : Audio {
    return new AudioClass(this.instanceArgs(object))
  }

  loadPromise(args: PreloadArgs): Promise<void> {
    const { editing, audible } = args
    if (!audible) return Promise.resolve()

    const { loadedAudio } = this
    if (loadedAudio) return Promise.resolve()


    const transcoding = editing ? this.preferredTranscoding(DefinitionType.Audio) : this
    
    const { request } = transcoding
    return requestAudioPromise(request).then(audio => {
      this.loadedAudio = audio
    })
  }

  type = DefinitionType.Audio as MediaDefinitionType

  // loadType = LoadType.Audio
}

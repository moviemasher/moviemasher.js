import type { PreloadArgs } from '../../Base/Code.js'
import type { Audio, AudioMedia, AudioMediaObject, AudioObject } from './Audio.js'
import { TypeAudio } from '../../Setup/Enums.js'
import {AudioClass} from './AudioClass.js'
import {UpdatableDurationDefinitionMixin} from '../../Mixin/UpdatableDuration/UpdatableDurationDefinitionMixin.js'
import {TweenableDefinitionMixin} from '../../Mixin/Tweenable/TweenableDefinitionMixin.js'
import {ContentDefinitionMixin} from '../Content/ContentDefinitionMixin.js'
import {MediaBase} from '../MediaBase.js'
import {errorThrow} from '../../Helpers/Error/ErrorFunctions.js'
import {isDefiniteError} from '../../Utility/Is.js'


const AudioMediaWithTweenable = TweenableDefinitionMixin(MediaBase)
const AudioMediaWithContent = ContentDefinitionMixin(AudioMediaWithTweenable)
const AudioMediaWithUpdatableDuration = UpdatableDurationDefinitionMixin(AudioMediaWithContent)
export class AudioMediaClass extends AudioMediaWithUpdatableDuration implements AudioMedia {
  constructor(object: AudioMediaObject) {
    super(object)
    const { loadedAudio } = object
    if (loadedAudio) this.loadedAudio = loadedAudio
  }

  instanceFromObject(object: AudioObject = {}) : Audio {
    return new AudioClass(this.instanceArgs(object))
  }

  loadPromise(args: PreloadArgs): Promise<void> {
    const { editing, audible } = args
    if (!audible) return Promise.resolve()

    const { loadedAudio } = this
    if (loadedAudio) return Promise.resolve()


    const transcoding = editing ? this.preferredTranscoding(TypeAudio) : this
    
    const { request } = transcoding
    return this.requestAudioPromise(request).then(orError => {
      if (isDefiniteError(orError)) return errorThrow(orError.error)

      const { data: clientAudio } = orError
      this.loadedAudio = clientAudio
    })
  }

  type = TypeAudio 
}

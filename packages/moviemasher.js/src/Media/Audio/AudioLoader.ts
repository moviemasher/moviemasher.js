import { LoadAudioPromise } from "../../declarations"
import { LoadType} from "../../Setup/Enums"
import { Loader } from "../../Loader/Loader"

class AudioLoader extends Loader {
  async requestUrl(url: string): LoadAudioPromise {
    const promise: LoadAudioPromise = new Promise((resolve, reject) => {
      this.arrayBufferPromiseFromUrl(url)
        .then(arrayBuffer => this.audioBufferPromiseFromArrayBuffer(arrayBuffer))
        .then(resolve)
        .catch(reject)
    })
    return promise
  }

  type = LoadType.Audio
}

export { AudioLoader }

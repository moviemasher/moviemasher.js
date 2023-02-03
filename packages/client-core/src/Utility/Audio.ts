import { AudibleContextInstance, LoadedAudio } from "@moviemasher/moviemasher.js"


  export const audioBufferPromise = (audio: ArrayBuffer): Promise<LoadedAudio | any> => {
    // console.log(this.constructor.name, "audioBufferPromise")

    return AudibleContextInstance.decode(audio).catch(error => {
      return { error }
    })
  }


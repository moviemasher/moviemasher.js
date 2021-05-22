import { Processor } from "./Processor"

class AudioProcessor extends Processor {
  get audioContext() { return this.object.audioContext }

  process(url, buffer) {
    return new Promise((resolve, reject) => {
      return this.audioContext.decodeAudioData(
        buffer,
        audioData => resolve(audioData),
        error => reject(error)
      )
    })
  }
}

export { AudioProcessor }

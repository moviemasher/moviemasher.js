import { Base } from "../Base"

class AudioProcessor extends Base {
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
import { Any } from "../Setup/declarations"
import { Errors } from "../Setup/Errors"
import { Time } from "../Utilities/Time"

const AudibleSampleRate = 44100
const AudibleChannels = 2

export class AudibleContext {
  __context? : AudioContext

  get context() : AudioContext {
    if (!this.__context) {
      const Klass = AudioContext || window.webkitAudioContext
      if (!Klass) throw Errors.audibleContext

      // console.log("AudibleContext context", Klass.name)
      this.__context = new Klass()
    }
    return this.__context
  }
  createBuffer(seconds : number) : AudioBuffer {
    const length = AudibleSampleRate * seconds
    // console.log(this.constructor.name, "createBuffer", length)
    return this.context.createBuffer(AudibleChannels, length, AudibleSampleRate)
  }

  createBufferSource() : AudioBufferSourceNode { return this.context.createBufferSource() }

  createGain() : GainNode { return this.context.createGain() }

  decode(buffer : ArrayBuffer) : Promise<AudioBuffer> {
    return new Promise((resolve, reject) => (
      this.context.decodeAudioData(
        buffer,
        audioData => resolve(audioData),
        error => reject(error)
      )
    ))
  }

  get destination() : AudioDestinationNode { return this.context.destination }

  get time() : Time { return Time.fromSeconds(this.currentTime) }

  get currentTime() : number { return this.context.currentTime }
}

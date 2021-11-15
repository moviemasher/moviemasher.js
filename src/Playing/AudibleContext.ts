import { AudibleSource } from "../declarations"
import { EventType } from "../Setup/Enums"
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

      this.__context = new Klass()
    }
    return this.__context
  }

  createBuffer(seconds : number) : AudioBuffer {
    const length = AudibleSampleRate * seconds
    return this.context.createBuffer(AudibleChannels, length, AudibleSampleRate)
  }

  createBufferSource(buffer?: AudioBuffer): AudibleSource {
    // console.trace(this.constructor.name, "createBufferSource")
    const sourceNode = this.context.createBufferSource()
    if (buffer) sourceNode.buffer = buffer
    return sourceNode
  }

  createGain() : GainNode { return this.context.createGain() }

  get currentTime() : number { return this.context.currentTime }

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

  emit(type: EventType): void { this.context.dispatchEvent(new CustomEvent(type)) }

  get time() : Time { return Time.fromSeconds(this.currentTime) }
}

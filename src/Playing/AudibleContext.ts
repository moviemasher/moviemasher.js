import { AudibleSource } from "../declarations"
import { Errors } from "../Setup/Errors"

const AudibleSampleRate = 44100
const AudibleChannels = 2

interface AudibleContextSource {
  gainNode: GainNode
  gainSource: AudibleSource
}

// singleton owned by Cache
class AudibleContext {
  addSource(id: string, source: AudibleContextSource): void {
    // console.log("addSource", id)
    this.sourcesByClipId.set(id, source)
  }

  private _context? : AudioContext

  get context() : AudioContext {
    if (!this._context) {
      const Klass = AudioContext || window.webkitAudioContext
      if (!Klass) throw Errors.audibleContext

      this._context = new Klass()
    }
    return this._context
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

  deleteSource(id: string): void {
    // console.log("deleteSource", id)
    const source = this.getSource(id)
    if (!source) return

    this.sourcesByClipId.delete(id)
    const { gainSource, gainNode } = source
    gainNode.disconnect(this.destination)
    gainSource.disconnect(gainNode)
    gainSource.stop()
  }

  get destination() : AudioDestinationNode { return this.context.destination }

  getSource(id: string): AudibleContextSource | undefined {
    return this.sourcesByClipId.get(id)
  }

  hasSource(id: string): boolean { return this.sourcesByClipId.has(id) }

  private sourcesByClipId = new Map<string, AudibleContextSource>()

  startAt(clipId: string, source: AudibleSource, start: number, duration: number, offset?: number, loops = false):void {
    const gainNode = this.createGain()
    source.loop = loops
    source.connect(gainNode)
    gainNode.connect(this.destination)
    source.start(this.currentTime + start, offset, duration)
    this.addSource(clipId, { gainSource: source, gainNode })
  }
}

export { AudibleContext }

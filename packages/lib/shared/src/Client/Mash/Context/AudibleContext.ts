import type { ClientAudioNode } from '../../../Helpers/ClientMedia/ClientMedia.js'
import { assertFunction } from '../../../Shared/SharedGuards.js'

const AudibleSampleRate = 44100
const AudibleChannels = 2

export interface AudibleContextData extends AudioContext {}

export interface AudibleContextSource {
  gainNode: GainNode
  gainSource: ClientAudioNode
}

export class AudibleContext {
  private addSource(id: string, source: AudibleContextSource): void {
    // console.log('addSource', id)
    this.sourcesById.set(id, source)
  }

  private _context? : AudibleContextData

  private get context() : AudibleContextData {
    if (!this._context) {
      const Klass = AudioContext || window.webkitAudioContext
      assertFunction(Klass)

      this._context = new Klass()
    }
    return this._context
  }

  createBuffer(seconds : number) : AudioBuffer {
    const length = AudibleSampleRate * seconds
    return this.context.createBuffer(AudibleChannels, length, AudibleSampleRate)
  }

  createBufferSource(buffer?: AudioBuffer): ClientAudioNode {
    // console.trace(this.constructor.name, 'createBufferSource')
    const sourceNode = this.context.createBufferSource()
    if (buffer) sourceNode.buffer = buffer
    return sourceNode
  }

  private createGain() : GainNode { return this.context.createGain() }

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
    // console.log('deleteSource', id)
    const source = this.getSource(id)
    if (!source) return

    this.sourcesById.delete(id)
    const { gainSource, gainNode } = source
    gainNode.disconnect(this.destination)
    gainSource.disconnect(gainNode)
    gainSource.stop()
  }

  get destination() : AudioDestinationNode { return this.context.destination }

  getSource(id: string): AudibleContextSource | undefined {
    return this.sourcesById.get(id)
  }

  hasSource(id: string): boolean { return this.sourcesById.has(id) }

  private sourcesById = new Map<string, AudibleContextSource>()

  startAt(id: string, source: ClientAudioNode, start: number, duration: number, offset?: number, loops = false):void {
    const gainNode = this.createGain()
    source.loop = loops
    source.connect(gainNode)
    gainNode.connect(this.destination)
    source.start(this.currentTime + start, offset, duration)
    this.addSource(id, { gainSource: source, gainNode })
  }
}

export const AudibleContextInstance = new AudibleContext()

import type { ClientAsset, ClientAudibleAsset } from '@moviemasher/runtime-client'
import type { AudibleAsset, Constrained } from '@moviemasher/runtime-shared'

const AudibleSampleRate = 44100
const AudibleChannels = 2

interface AudibleContextSource {
  gainNode: GainNode
  gainSource: AudioBufferSourceNode
}

export class AudibleContextClass {
  private addSource(id: string, source: AudibleContextSource): void {
    // console.log('addSource', id)
    this.sourcesById.set(id, source)
  }

  private _context? : AudioContext

  private get context() : AudioContext {
    if (!this._context) {
      const Klass = AudioContext || window.webkitAudioContext
      this._context = new Klass()
    }
    return this._context
  }

  createBuffer(seconds : number) : AudioBuffer {
    const length = AudibleSampleRate * seconds
    return this.context.createBuffer(AudibleChannels, length, AudibleSampleRate)
  }

  createBufferSource(buffer?: AudioBuffer): AudioBufferSourceNode {
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

  startAt(id: string, source: AudioBufferSourceNode, start: number, duration: number, offset?: number, loops = false):void {
    const gainNode = this.createGain()
    source.loop = loops
    source.connect(gainNode)
    gainNode.connect(this.destination)
    source.start(this.currentTime + start, offset, duration)
    this.addSource(id, { gainSource: source, gainNode })
  }
}

export const AUDIBLE_CONTEXT = new AudibleContextClass()

export function ClientAudibleAssetMixin
<T extends Constrained<ClientAsset & AudibleAsset>>(Base: T):
T & Constrained<ClientAudibleAsset> {
  return class extends Base implements ClientAudibleAsset {
    audibleSource(): AudioBufferSourceNode | undefined {
      const { loadedAudio } = this
      if (loadedAudio) {
        // console.log(this.constructor.name, 'audibleSource loadedAudio')
        return AUDIBLE_CONTEXT.createBufferSource(loadedAudio)
      }
      return 
    }

    loadedAudio?: AudioBuffer
  }
}

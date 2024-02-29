import type { AudibleAsset, AudibleInstance, ClientAsset, ClientAudibleAsset, ClientAudibleInstance, ClientAudio, ClientInstance, ClientMedia, Constrained, DataOrError, Property, Scalar, ScalarTuple, Size, SvgItem } from '../types.js'

import { $ALPHA, $AUDIO, $IMAGE, $WAVEFORM, ERROR, FRAMES_MINIMUM, MOVIE_MASHER, errorPromise, isDefiniteError } from '../runtime.js'
import { isClientAudio } from '../utility/guard.js'
import { assertAboveZero, assertDefined, assertPositive } from '../utility/guards.js'
import { svgColorMask, svgSetDimensions } from '../utility/svg.js'
import { timeFromArgs, timeFromSeconds } from '../utility/time.js'
import { pixelFromFrame } from '../utility/pixel.js'

const AudibleSampleRate = 44100
const AudibleChannels = 2

interface AudibleContextSource {
  gainNode: GainNode
  gainSource: AudioBufferSourceNode
}

class AudibleContextClass {
  private addSource(id: string, source: AudibleContextSource): void {
    // console.log(this.constructor.name, 'addSource', id)
    this.sourcesById.set(id, source)
  }

  private _context? : AudioContext

  private get audioContext() : AudioContext {
    if (!this._context) {
      const Klass = AudioContext || window.webkitAudioContext
      this._context = new Klass()
    }
    return this._context
  }

  createBuffer(seconds : number) : ClientAudio {
    const length = AudibleSampleRate * seconds
    return this.audioContext.createBuffer(AudibleChannels, length, AudibleSampleRate)
  }

  createBufferSource(buffer?: ClientMedia): AudioBufferSourceNode | undefined {
    if (!isClientAudio(buffer)) return
    
    const sourceNode = this.audioContext.createBufferSource()
    sourceNode.buffer = buffer
    return sourceNode
  }

  private createGain() : GainNode { return this.audioContext.createGain() }

  get currentTime() : number { return this.audioContext.currentTime }

  decode(buffer : ArrayBuffer) : Promise<ClientAudio> {
    return new Promise((resolve, reject) => (
      this.audioContext.decodeAudioData(
        buffer,
        audioData => resolve(audioData),
        error => reject(error)
      )
    ))
  }

  deleteSource(id: string): void {
    // console.log(this.constructor.name, 'deleteSource', id)
    const source = this.getSource(id)
    if (!source) return

    this.sourcesById.delete(id)
    const { gainSource, gainNode } = source
    gainNode.disconnect(this.destination)
    gainSource.disconnect(gainNode)
    gainSource.stop()
  }

  get destination() : AudioDestinationNode { return this.audioContext.destination }

  getSource(id: string): AudibleContextSource | undefined {
    return this.sourcesById.get(id)
  }

  hasSource(id: string): boolean { return this.sourcesById.has(id) }

  private sourcesById = new Map<string, AudibleContextSource>()

  startAt(id: string, source: AudioBufferSourceNode, start: number, duration: number, speed = 1.0, offset?: number, _loops = false):void {
    const gainNode = this.createGain()
    // source.loop = true//loops
    source.playbackRate.value = speed

    source.connect(gainNode)
    gainNode.connect(this.destination)
    // console.log(this.constructor.name, 'startAt', { start, duration, speed, offset })
    source.start(this.currentTime + start, offset, duration * speed)
    this.addSource(id, { gainSource: source, gainNode })
  }
}

export const AUDIBLE_CONTEXT = new AudibleContextClass()

export function ClientAudibleAssetMixin
<T extends Constrained<ClientAsset & AudibleAsset>>(Base: T):
T & Constrained<ClientAudibleAsset> {
  return class extends Base implements ClientAudibleAsset {
    audibleSource(): AudioBufferSourceNode | undefined {
      const resource = this.resourceOfType($AUDIO)
      if (!resource) return

      return AUDIBLE_CONTEXT.createBufferSource(resource.request.response)
    }
  }
}

export function ClientAudibleInstanceMixin<T extends Constrained<ClientInstance & AudibleInstance>>(Base: T):
  T & Constrained<ClientAudibleInstance> {
  return class extends Base implements ClientAudibleInstance {
    declare asset: ClientAudibleAsset

    audiblePreviewPromise(clipSize: Size, scale?: number): Promise<DataOrError<SvgItem>> {
      const speed = this.number('speed')
      const { asset, clip } = this
      const resource = asset.resourceOfType($WAVEFORM)
      if (!resource) return errorPromise(ERROR.Unavailable, $WAVEFORM)

      assertAboveZero(scale)
      const { track } = clip
      assertDefined(track)

      const fps = Number(track.mash.value('quantize'))
      const [_, startTrimFrame] = this.assetFrames(fps)
      const assetFrames = asset.frames(fps)
      const assetFramesTime = timeFromArgs(assetFrames, fps)
      const widthTime = timeFromSeconds(assetFramesTime.seconds / speed, fps)
      const x = -pixelFromFrame(startTrimFrame / speed, scale)
      const width = pixelFromFrame(widthTime.frame, scale)
      const { height } = clipSize
      const rect = { x, y: 0, width, height }
      const imageResource = { ...resource, type: $IMAGE }
      return asset.assetIconPromise(imageResource, rect, false).then(orError => {
        if (isDefiniteError(orError)) return orError

        const { data: svgItem } = orError
        svgSetDimensions(svgItem, rect)
        const { waveformTransparency = $ALPHA } = MOVIE_MASHER.options
        return { data: svgColorMask(svgItem, clipSize, waveformTransparency, 'fore', rect) }
      })
    }

    override constrainedValue(property: Property, scalar?: Scalar): Scalar | undefined {
      const value = super.constrainedValue(property, scalar)
      const { name } = property
      switch (name) {
        case 'speed':
        case 'endTrim':
        case 'startTrim': {
          const isSpeed = name === 'speed'
          if (isSpeed) assertAboveZero(value, name)
          else assertPositive(value, name)

          const speed = this.number('speed')

          const { clip, asset } = this
          const { track, frame } = clip
          assertDefined(track)

          const { mash, clips, dense } = track
          const quantize = mash.number('quantize')
         
          const index = clips.indexOf(clip)
          const isLast = index === clips.length - 1
          const maxFrames = asset.frames(quantize)
          const unconstrained = (dense || isLast)
          const framesUntilClip = unconstrained ? 0 : (clips[index + 1].frame - frame)
          if (isSpeed) {
            if (unconstrained || value > speed) break

            const [durationFrames, startTrimFrame, endTrimFrame] = this.assetFrames(quantize)
            const totalFrames = durationFrames - (startTrimFrame + endTrimFrame)
            const minValue = totalFrames / framesUntilClip
            return Math.max(value, minValue)
          }
          const frames = unconstrained ? maxFrames : framesUntilClip * speed
          const otherName = name === 'startTrim' ? 'endTrim' : 'startTrim'
          const other = this.number(otherName)
          assertPositive(other, otherName)

          const minFrames = (maxFrames - FRAMES_MINIMUM)
          const otherValue = other * minFrames
          const maxTrim = maxFrames - (otherValue + FRAMES_MINIMUM)
          const minTrim = maxFrames - (frames + otherValue)
          const min = minTrim / minFrames
          const max = maxTrim / minFrames
          return Math.min(max, Math.max(value, min))
        }
      }
      return value
    }

    override setValue(id: string, value?: Scalar): ScalarTuple {
      const tuple = super.setValue(id, value)
      const [name] = tuple
      switch (name) {
        case 'startTrim':
        case 'endTrim':
        case 'speed':
          this.clip.resetTiming(this)
          break
      }
      return tuple
    }
  }
}

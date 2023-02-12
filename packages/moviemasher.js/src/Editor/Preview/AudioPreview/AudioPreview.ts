import { Time } from "../../../Helpers/Time/Time"
import { Clip } from "../../../Media/Mash/Track/Clip/Clip"

export interface AudioPreview {
  adjustClipGain(clip: Clip, quantize: number): void
  buffer: number
  bufferClips(clips: Clip[], quantize: number): boolean 
  seconds: number
  setGain(value : number, quantize: number): void
  startContext(): void
  startPlaying(time: Time, clips: Clip[], quantize: number): boolean 
  stopContext(): void
  stopPlaying(): void  
}

export interface AudioPreviewArgs {
  buffer? : number
  gain? : number
}


export interface StartOptions {
  duration: number
  offset?: number
  start: number
}
